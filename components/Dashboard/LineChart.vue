<template>
  <div :id="chartId">
    <el-button class="reset-button" round @click="resetChart">
      Reset Chart
    </el-button>
    <div class="tooltip" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as d3 from 'd3'
import { ElButton } from 'element-plus'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const props = defineProps({
  metric: { type: Object, required: true },
  data: { type: Array, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  margin: { type: Object, required: true },
})

const store = useDashboardUIStore()
const { dataDashboardValues, dateRangeUpdate } = storeToRefs(store)
const { updateDataDashboardValues } = store

const chartId = ref(`chart-${Date.now()}`)
let svg, x, y, xAxis, yAxis, line, brush

const createLineChart = () => {
  if (props.width <= 0 || !props.data.length) return

  const chartDiv = d3.select(`#${chartId.value}`)
  chartDiv.selectAll('*').remove() // Clear previous chart

  svg = chartDiv
    .append('svg')
    .attr('width', props.width + props.margin.left + props.margin.right)
    .attr('height', props.height + props.margin.top + props.margin.bottom)
    .append('g')
    .attr('transform', `translate(${props.margin.left},${props.margin.top})`)

  x = d3.scaleTime().range([0, props.width])
  y = d3.scaleLinear().range([props.height, 0])

  xAxis = d3.axisBottom(x)
  yAxis = d3.axisLeft(y)

  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${props.height})`)
  svg.append('g').attr('class', 'y-axis')

  x.domain(d3.extent(props.data, (d) => d.date))
  y.domain([0, d3.max(props.data, (d) => d.value)])

  svg.select('.x-axis').call(xAxis)
  svg.select('.y-axis').call(yAxis)

  line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.value))

  svg
    .append('path')
    .data([props.data])
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', line)

  brush = d3
    .brushX()
    .extent([
      [0, 0],
      [props.width, props.height],
    ])
    .on('end', updateChart)

  svg.append('g').attr('class', 'brush').call(brush)

  // Add labels
  svg
    .append('text')
    .attr('x', props.width / 2)
    .attr('y', props.height + props.margin.bottom - 10)
    .attr('text-anchor', 'middle')
    .text('Time')

  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - props.margin.left)
    .attr('x', 0 - props.height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text(props.metric.label)
}

const updateChart = (event) => {
  if (!event || !event.selection) return
  const [x0, x1] = event.selection.map(x.invert)
  updateDataDashboardValues('dateRange', [x0, x1])
  x.domain([x0, x1])
  svg.select('.x-axis').call(xAxis)
  svg.select('.line').attr('d', line)
}

const resetChart = () => {
  x.domain(d3.extent(props.data, (d) => d.date))
  svg.select('.x-axis').call(xAxis)
  svg.select('.line').attr('d', line)
  svg.select('.brush').call(brush.move, null)
}

watch(() => props.data, createLineChart, { deep: true })
watch(() => props.width, createLineChart)
watch(dateRangeUpdate, () => {
  if (dataDashboardValues.value.dateRange.length === 2) {
    x.domain(dataDashboardValues.value.dateRange)
    svg.select('.x-axis').call(xAxis)
    svg.select('.line').attr('d', line)
  }
})

onMounted(createLineChart)
onUnmounted(() => {
  d3.select(`#${chartId.value}`).selectAll('*').remove()
})
</script>

<style scoped>
.tooltip {
  position: absolute;
  text-align: left;
  padding: 5px;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0;
  border-radius: 8px;
  pointer-events: none;
}

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 1.5px;
}

.brush .selection {
  fill: steelblue;
  fill-opacity: 0.3;
}

.reset-button {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
