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
  <div :id="chartId" class="relative">
    <UButton
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
import { useDashboardUIStore } from '@/stores/dashboardUI'
import { storeToRefs } from 'pinia'

/**
 * Represents a single data point in the chart
 * @typedef {Object} DataPoint
 * @property {Date} date - The date of the data point
 * @property {number} value - The value of the data point
 */

/**
 * Props for the LineChart component
 * @typedef {Object} LineChartProps
 * @property {{label: string}} metric - The metric information for the chart
 * @property {{data: DataPoint[], min: number, max: number}} data - The chart data and range
 * @property {number} width - The width of the chart
 * @property {number} height - The height of the chart
 * @property {{top: number, right: number, bottom: number, left: number}} margin - The chart margins
 */

/**
 * Component props
 * @type {LineChartProps}
 */
const props = defineProps<{
  metric: { label: string }
  data: { data: DataPoint[]; min: number; max: number }
  width: number
  height: number
  margin: { top: number; right: number; bottom: number; left: number }
}>()

const store = useDashboardUIStore()
const { dataDashboardValues, dateRangeUpdate } = storeToRefs(store)
const { updateDataDashboardValues } = store

/**
 * Unique ID for the chart container
 * @type {import('vue').Ref<string>}
 */
const chartId = ref(`chart-${Date.now()}`)

/**
 * D3 selection for the SVG element
 * @type {d3.Selection<SVGGElement, unknown, HTMLElement, any>}
 */
let svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>

/**
 * D3 scale for the x-axis (time)
 * @type {d3.ScaleTime<number, number>}
 */
let x: d3.ScaleTime<number, number>

/**
 * D3 scale for the y-axis (values)
 * @type {d3.ScaleLinear<number, number>}
 */
let y: d3.ScaleLinear<number, number>

/**
 * D3 axis generator for the x-axis
 * @type {d3.Axis<Date>}
 */
let xAxis: d3.Axis<Date>

/**
 * D3 axis generator for the y-axis
 * @type {d3.Axis<number>}
 */
let yAxis: d3.Axis<number>

/**
 * D3 line generator for the chart
 * @type {d3.Line<DataPoint>}
 */
let line: d3.Line<DataPoint>

/**
 * D3 brush behavior for the chart
 * @type {d3.BrushBehavior<unknown>}
 */
let brush: d3.BrushBehavior<unknown>

/**
 * Creates and renders the line chart
 */
const createLineChart = () => {
  if (props.width <= 0 || !props.data.data || props.data.data.length === 0)
    return

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

  // Ensure dates are parsed correctly
  const parseDate = d3.isoParse
  const data = props.data.data.map((d) => ({
    ...d,
    date: parseDate(d.date) as Date,
  }))

  // Determine x and y domains from the data
  const xDomain = d3.extent(data, (d) => d.date) as [Date, Date]
  const yDomain = [props.data.min, props.data.max]

  x = d3.scaleTime().range([0, width]).domain(xDomain)
  y = d3.scaleLinear().range([height, 0]).domain(yDomain).nice()

  xAxis = d3
    .axisBottom(x)
    .ticks(5)
    .tickFormat(d3.timeFormat('%Y-%m-%d') as any)
    .tickSizeOuter(0)

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
}

watch(() => props.data, createLineChart, { deep: true })
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
