<!--
 * LineChart Component
 * 
 * This component renders a line chart for sensor data using D3.js.
 * It supports zooming, brushing, and dynamic updates based on global date range changes.
 * 
 * @displayName LineChart
 * @usage
 * <LineChart
 *   :metric="{ label: 'Temperature (°C)' }"
 *   :data="{ data: [...], min: 0, max: 100 }"
 *   :width="600"
 *   :height="300"
 *   :margin="{ top: 20, right: 20, bottom: 30, left: 40 }"
 * />
 -->

<template>
  <div :id="chartId" class="relative" data-testid="chart-container">
    <UButton
      data-testid="reset-button"
      class="reset-button"
      icon="i-heroicons-arrow-path"
      @click="resetChart"
    >
      Reset Chart
    </UButton>
    <div class="tooltip" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as d3 from 'd3'
import { useDashboardStore } from '../../stores/dashboard'
import { storeToRefs } from 'pinia'

interface DataPoint {
  date: Date
  value: number
}

interface ChartData {
  data: { date: string; value: number }[]
  min: number
  max: number
}

interface ChartProps {
  metric: { label: string }
  data: ChartData
  width: number
  height: number
  margin: { top: number; right: number; bottom: number; left: number }
}

const props = withDefaults(defineProps<ChartProps>(), {
  data: () => ({
    data: [],
    min: 0,
    max: 100,
  }),
  width: 0,
  height: 300,
  margin: () => ({ top: 20, right: 20, bottom: 30, left: 40 }),
})

const store = useDashboardStore()
const { dataDashboardValues, dateRangeUpdate } = storeToRefs(store)
const { updateDataDashboardValues } = store

const chartId = ref(`chart-${Date.now()}`)
let svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>
let x: d3.ScaleTime<number, number>
let y: d3.ScaleLinear<number, number>
let xAxis: d3.Axis<Date>
let yAxis: d3.Axis<number>
let line: d3.Line<DataPoint>
let brush: d3.BrushBehavior<unknown>

const createLineChart = () => {
  if (!props.data?.data || !Array.isArray(props.data.data)) {
    console.log('Invalid or missing data')
    return
  }

  if (props.width <= 0 || props.data.data.length === 0) {
    console.log('Invalid dimensions or empty data')
    return
  }

  try {
    const chartDiv = d3.select(`#${chartId.value}`)
    chartDiv.selectAll('*').remove()

    const width = props.width - props.margin.left - props.margin.right
    const height = props.height - props.margin.top - props.margin.bottom

    svg = chartDiv
      .append('svg')
      .attr('width', width + props.margin.left + props.margin.right)
      .attr('height', height + props.margin.top + props.margin.bottom)
      .attr('data-testid', 'chart-svg')
      .append('g')
      .attr('transform', `translate(${props.margin.left},${props.margin.top})`)

    const parseDate = d3.isoParse
    const data = props.data.data
      .filter((d) => d && d.date && !isNaN(d.value))
      .map((d) => ({
        date: parseDate(d.date) || new Date(),
        value: Number(d.value) || 0,
      }))

    if (data.length === 0) {
      console.log('No valid data points after parsing')
      return
    }

    const xDomain = d3.extent(data, (d) => d.date) as [Date, Date]
    const yDomain = [
      props.data.min ?? d3.min(data, (d) => d.value) ?? 0,
      props.data.max ?? d3.max(data, (d) => d.value) ?? 100,
    ]

    x = d3.scaleTime().range([0, width]).domain(xDomain)
    y = d3.scaleLinear().range([height, 0]).domain(yDomain).nice()

    xAxis = d3
      .axisBottom(x)
      .ticks(5)
      .tickFormat(d3.timeFormat('%Y-%m-%d') as any)

    yAxis = d3
      .axisLeft(y)
      .ticks(5)
      .tickFormat((d) => d3.format('.2f')(d))

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

    line = d3
      .line<DataPoint>()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
      .defined((d) => !isNaN(d.value))

    svg
      .append('path')
      .datum(data)
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
  } catch (error) {
    console.error('Error creating chart:', error)
  }
}

/**
 * Updates the chart based on brush selection
 * @param {d3.D3BrushEvent<any>} event - The brush event
 */
const updateChart = (event: d3.D3BrushEvent<any>) => {
  if (!event.selection) return
  const [x0, x1] = event.selection.map(x.invert) as [Date, Date]
  updateDataDashboardValues('dateRange', [x0, x1])
  x.domain([x0, x1])
  svg.select('.x-axis').call(xAxis as any)
  svg.select('.line').attr('d', line)
}

/**
 * Resets the chart to its initial state
 */
const resetChart = () => {
  const data = props.data.data.map((d) => ({
    ...d,
    date: d3.isoParse(d.date) as Date,
  }))
  const xDomain = d3.extent(data, (d) => d.date) as [Date, Date]
  x.domain(xDomain)
  y.domain([props.data.min, props.data.max]).nice()
  svg.select('.x-axis').call(xAxis as any)
  svg.select('.y-axis').call(yAxis as any)
  svg.select('.line').attr('d', line)
  svg.select('.brush').call(brush.move, null)

  // Add this line to update the store's dateRange
  updateDataDashboardValues('dateRange', xDomain)
}

watch(
  () => props.data,
  (newData) => {
    if (newData?.data) {
      console.log('Chart data updated:', newData)
      createLineChart()
    }
  },
  { deep: true }
)
watch(() => props.width, createLineChart)
watch(dateRangeUpdate, () => {
  if (dataDashboardValues.value.dateRange.length === 2) {
    x.domain(dataDashboardValues.value.dateRange as [Date, Date])
    svg.select('.x-axis').call(xAxis as any)
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
