<template>
  <!-- <div ref="currentContainer" class="current-container"></div> -->
  <div id="chart">
    <el-button id="reset-button" round>Reset Chart</el-button>
  </div>
</template>

<script setup>
import * as d3 from 'd3'
import { useParentElement } from '@vueuse/core'
import { ElButton } from 'element-plus'

const store = useDashboardUIStore()
const { dataDashboardValues, dateRangeUpdate } = storeToRefs(store)
const { updateDataDashboardValues } = store

const currentContainer = useParentElement()

const props = defineProps({
  metric: { type: Object, default: () => {} },
  data: { type: Array, default: () => [] },
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  margin: {
    type: Object,
    default: () => ({ top: 30, right: 30, bottom: 50, left: 60 }),
  },
})

const updateChartGlobal = ref(null)
const brushGlobalDOM = ref(null)
const brushGlobal = ref(null)

watch(
  () => dateRangeUpdate.value,
  (n) => {
    console.log(n, ' value changed')
    programmaticUpdate()
  }
)

const chartHeight = 300 // Fixed height for each chart

const programmaticUpdate = () => {
  updateChartGlobal.value(undefined, dataDashboardValues.value.dateRange)
  // brushGlobalDOM.value.call(
  //   brushGlobal.value.move,
  //   [336.19921875, 646.19921875]
  // )
}

const createLineCharts = () => {
  if (props.width <= 0) return
  //   const chartDiv = document.createElement('div')
  const chartDiv = d3.select('#chart').node()
  //   chartDiv.id = props.metric.name
  chartDiv.style.height = `${chartHeight}px`
  chartDiv.style.marginBottom = '50px'

  const svg = d3
    .select(chartDiv)
    .append('svg')
    .attr('width', props.width + props.margin.left + props.margin.right)
    .attr('height', props.height + props.margin.top + props.margin.bottom)
    .append('g')
    .attr('transform', `translate(${props.margin.left},${props.margin.top})`)

  const x = d3.scaleTime().range([0, props.width])
  const y = d3.scaleLinear().range([props.height, 0])

  // use d3 scaleTime to go from date to extent

  const xAxis = d3.axisBottom(x)
  const yAxis = d3.axisLeft(y)

  const circleRadius = 2

  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${props.height})`)
  svg.append('g').attr('class', 'y-axis')

  x.domain(d3.extent(props.data, (d) => d.date))
  y.domain([0, d3.max(props.data, (d) => d.value)])

  svg.select('.x-axis').call(xAxis)
  svg.select('.y-axis').call(yAxis)

  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.value))

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 1)

  svg
    .append('path')
    .data([props.data])
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', line)

  svg
    .selectAll('dot')
    .data(props.data)
    .enter()
    .append('circle')
    .attr('r', circleRadius)
    .attr('fill', 'steelblue')
    .attr('stroke', 'none')
    .attr('cx', (d) => x(d.date))
    .attr('cy', (d) => y(d.value))
    .on('mouseover', function (event, d) {
      tooltip.transition().duration(200).style('opacity', 0.9)
      tooltip
        .html(`Date: ${d.date}<br>Value: ${d.value}`)
        .style('left', `${event.pageX + 5}px`)
        .style('top', `${event.pageY - 28}px`)
    })
    .on('mouseout', function () {
      tooltip.transition().duration(500).style('opacity', 0)
    })

  const brush = d3
    .brushX()
    .extent([
      [0, 0],
      [props.width, props.height],
    ])
    .on('end', updateChart)

  const brushSelection = svg.append('g').attr('class', 'brush').call(brush)
  brushGlobal.value = brush
  brushGlobalDOM.value = brushSelection

  function updateChart(event, dates) {
    if (event !== undefined) {
      const extent = event.selection
      if (!extent) return

      updateDataDashboardValues('dateRange', [
        x.invert(extent[0]),
        x.invert(extent[1]),
      ])
      updateDataDashboardValues('dataRangeValues', extent)

      // Update x domain based on selection
      x.domain([x.invert(extent[0]), x.invert(extent[1])])
    } else {
      x.domain(dates)
    }

    // Remove existing line and circles
    svg.selectAll('.line').remove()
    svg.selectAll('circle').remove()

    // Add the updated line
    svg
      .append('path')
      .data([props.data])
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line)

    // Add updated circles
    svg
      .selectAll('dot')
      .data(props.data)
      .enter()
      .append('circle')
      .attr('r', circleRadius) // Smaller radius for circles
      .attr('fill', 'steelblue')
      .attr('stroke', 'none')
      .attr('cx', (d) => x(d.date))
      .attr('cy', (d) => y(d.value))
      .on('mouseover', function (event, d) {
        tooltip.transition().duration(200).style('opacity', 0.9)
        tooltip
          .html(`Date: ${d.date}<br>Value: ${d.value}`)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`)
      })
      .on('mouseout', function () {
        tooltip.transition().duration(500).style('opacity', 0)
      })

    // Update the axes
    svg.select('.x-axis').call(xAxis)
    svg.select('.y-axis').call(yAxis)
  }
  updateChartGlobal.value = updateChart

  function resetChart() {
    // Reset x domain to the original extent
    x.domain(d3.extent(props.data, (d) => d.date))

    // Remove existing line and circles
    svg.selectAll('.line').remove()
    svg.selectAll('circle').remove()

    // Add the original line
    svg
      .append('path')
      .data([props.data])
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line)

    // Add original circles
    svg
      .selectAll('dot')
      .data(props.data)
      .enter()
      .append('circle')
      .attr('r', 3) // Smaller radius for circles
      .attr('fill', 'steelblue')
      .attr('stroke', 'none')
      .attr('cx', (d) => x(d.date))
      .attr('cy', (d) => y(d.value))
      .on('mouseover', function (event, d) {
        tooltip.transition().duration(200).style('opacity', 0.9)
        tooltip
          .html(`Date: ${d.date}<br>Value: ${d.value}`)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`)
      })
      .on('mouseout', function () {
        tooltip.transition().duration(500).style('opacity', 0)
      })

    // Update the axes
    svg.select('.x-axis').call(xAxis)
    svg.select('.y-axis').call(yAxis)

    // Clear the brush selection
    brushSelection.call(brush.move, null)
  }

  d3.select('#reset-button').node().addEventListener('click', resetChart)

  svg
    .append('text')
    .attr('x', props.width / 2)
    .attr('y', 0 - props.margin.top / 2)
    .attr('text-anchor', 'middle')
    .attr('font-size', '16px')
    .attr('font-weight', 'bold')
    .text(props.metric.label)

  svg
    .append('text')
    .attr('x', props.width / 2)
    .attr('y', props.height + props.margin.bottom - 10)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .text('Time')

  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - props.margin.left + 10)
    .attr('x', 0 - props.height / 2)
    .attr('dy', '1em')
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .text(props.metric.label)
  currentContainer.value.appendChild(chartDiv)
}

onMounted(() => {
  createLineCharts()
})

// watchEffect(() => {
//   createLineCharts()
// })
</script>

<style scoped>
.tooltip {
  position: absolute;
  text-align: center;
  width: 60px;
  height: 28px;
  padding: 2px;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
}

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 1.5px;
}

.circle {
  fill: steelblue;
  stroke: none;
}

.brush .selection {
  fill: steelblue;
  fill-opacity: 0.3;
}
</style>
