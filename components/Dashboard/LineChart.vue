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
import 'element-plus/dist/index.css'
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

const metricRanges = {
  temperature: {
    min: -2,
    max: 50,
    format: (d) => `${d.toFixed(0)}°C`,
    ticks: 6,
  },
  relative_humidity: {
    min: 0,
    max: 100,
    format: (d) => `${d.toFixed(0)}%`,
    ticks: 5,
  },
  voc: { min: 0, max: 600, format: (d) => `${d.toFixed(0)}`, ticks: 5 },
  nox: { min: 0, max: 4, format: (d) => `${d.toFixed(0)}`, ticks: 5 },
  pm1: { min: 0, max: 3000, format: (d) => `${d.toFixed(1)}`, ticks: 5 },
  pm25: { min: 0, max: 3000, format: (d) => `${d.toFixed(1)}`, ticks: 5 },
  pm4: { min: 0, max: 3000, format: (d) => `${d.toFixed(1)}`, ticks: 5 },
  pm10: { min: 0, max: 3000, format: (d) => `${d.toFixed(1)}`, ticks: 5 },
}

const createLineChart = () => {
  if (props.width <= 0 || !props.data.length) return

  const chartDiv = d3.select(`#${chartId.value}`)
  chartDiv.selectAll('*').remove() // Clear previous chart

  const margin = { top: 20, right: 30, bottom: 50, left: 50 }
  const width = props.width - margin.left - margin.right
  const height = props.height - margin.top - margin.bottom

  svg = chartDiv
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  x = d3.scaleTime().range([0, width])
  y = d3.scaleLinear().range([height, 0])

  xAxis = d3.axisBottom(x).ticks(5).tickSizeOuter(0)
  yAxis = d3.axisLeft(y)

  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-45)')

  svg.append('g').attr('class', 'y-axis').call(yAxis)

  x.domain(d3.extent(props.data, (d) => d.date))

  const metricRange = metricRanges[props.metric.name]
  if (metricRange) {
    y.domain([metricRange.min, metricRange.max])
    yAxis.tickFormat(metricRange.format).ticks(metricRange.ticks)

    const outOfRangeData = props.data.filter(
      (d) => d.value < metricRange.min || d.value > metricRange.max
    )
    if (outOfRangeData.length > 0) {
      console.warn(
        `Warning: Some ${props.metric.name} data points are out of the fixed range:`,
        outOfRangeData
      )
    }
  } else {
    y.domain([0, d3.max(props.data, (d) => d.value)])
  }

  svg.select('.y-axis').call(yAxis)

  console.log('Y axis range for', props.metric.name, ':', y.domain())

  line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.value))
    .defined((d) => !isNaN(d.value))

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
      [width, height],
    ])
    .on('end', updateChart)

  svg.append('g').attr('class', 'brush').call(brush)

  // Add x-axis label
  svg
    .append('text')
    .attr('class', 'x-axis-label')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 5)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .text('Time')

  // Add y-axis label
  svg
    .append('text')
    .attr('class', 'y-axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
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
  z-index: 10;
}

.x-axis text,
.y-axis text {
  font-size: 10px;
}

.x-axis-label,
.y-axis-label {
  fill: #666;
}
</style>
