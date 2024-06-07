<!-- <template>
  <div ref="currentContainer" class="current-container"></div>
</template> -->

<script setup>
import * as d3 from 'd3'
import { ref, onMounted } from 'vue'
import { useParentElement } from '@vueuse/core'

import { useDashboardUIStore } from '@/stores/dashboardUI'

const currentContainer = useParentElement()

const chartHeight = 300 // Fixed height for each chart

// watch(existingDatasets, (newDatasets) => {
//   console.log('Datasets changed', newDatasets)
// })

onUpdated(() => {
  // text content should be the same as current `count.value`
  //   console.log(
  //     parentEl.value.clientWidth,
  //     'updatedddd',
  //     props.height,
  //     props.width
  //   )
  createLineCharts()
})

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

// const props = defineProps(['visible'])
// const emit = defineEmits(['close'])

// const closeModal = () => {
//   emit('close')
// }
const createLineCharts = () => {
  //   console.log('Creating line charts', props.metric)
  if (props.width <= 0) return
  const chartDiv = document.createElement('div')
  chartDiv.id = props.metric.name
  chartDiv.style.height = `${chartHeight}px`
  chartDiv.style.marginBottom = '50px'

  const resetButton = document.createElement('button')
  resetButton.textContent = 'Reset'
  resetButton.style.marginBottom = '10px'
  chartDiv.appendChild(resetButton)

  //   const margin = { top: 30, right: 30, bottom: 50, left: 60 },
  //     width = currentContainer.value.clientWidth - margin.left - margin.right,
  //     height = chartHeight - margin.top - margin.bottom

  const svg = d3
    .select(chartDiv)
    .append('svg')
    .attr('width', props.width + props.margin.left + props.margin.right)
    .attr('height', props.height + props.margin.top + props.margin.bottom)
    .append('g')
    .attr('transform', `translate(${props.margin.left},${props.margin.top})`)

  const x = d3.scaleTime().range([0, props.width])
  const y = d3.scaleLinear().range([props.height, 0])

  const xAxis = d3.axisBottom(x)
  const yAxis = d3.axisLeft(y)

  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${props.height})`)
  svg.append('g').attr('class', 'y-axis')

  const metricData = props.data.map((d) => ({
    date: d.date,
    value: d[props.metric.name],
  }))

  x.domain(d3.extent(metricData, (d) => d.date))
  y.domain([0, d3.max(metricData, (d) => d.value)])

  svg.select('.x-axis').call(xAxis)
  svg.select('.y-axis').call(yAxis)

  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.value))

  svg
    .append('path')
    .data([metricData])
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', line)

  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)

  svg
    .selectAll('dot')
    .data(metricData)
    .enter()
    .append('circle')
    .attr('r', 1)
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

  function updateChart(event) {
    const extent = event.selection
    if (!extent) return

    // Update x domain based on selection
    x.domain([x.invert(extent[0]), x.invert(extent[1])])

    // Remove existing line and circles
    svg.selectAll('.line').remove()
    svg.selectAll('circle').remove()

    // Add the updated line
    svg
      .append('path')
      .data([metricData])
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line)

    // Add updated circles
    svg
      .selectAll('dot')
      .data(metricData)
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
  }

  function resetChart() {
    // Reset x domain to the original extent
    x.domain(d3.extent(metricData, (d) => d.date))

    // Remove existing line and circles
    svg.selectAll('.line').remove()
    svg.selectAll('circle').remove()

    // Add the original line
    svg
      .append('path')
      .data([metricData])
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line)

    // Add original circles
    svg
      .selectAll('dot')
      .data(metricData)
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

  resetButton.addEventListener('click', resetChart)

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
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 53%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 95%;
  height: 85%;
  background-color: white;
  border-radius: 15px;
  box-shadow: 10px 10px 35px rgba(0, 0, 0, 0.35);
  z-index: 10;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: lightgray;
  cursor: pointer;
}

.close-btn:hover {
  color: #609f80;
}

.current-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  width: calc(100% - 320px);
  height: 95%;
  padding: 5px;
  margin-left: 300px;
  margin-top: 50px;
  margin-bottom: 30px;
}

.current-container::-webkit-scrollbar {
  width: 10px;
  background-color: transparent;
}

.current-container::-webkit-scrollbar-thumb {
  background-color: #609f80;
  border-radius: 10px;
  border: 1px solid transparent;
  background-clip: padding-box;
}

.current-container::-webkit-scrollbar-button {
  display: none;
}

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
