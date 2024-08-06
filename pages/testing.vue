<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div ref="chartContainer"></div>
</template>

<script setup>
import * as d3 from 'd3'
import { ref, onMounted } from 'vue'

const chartContainer = ref(null)

const createLineCharts = (data) => {
  const metrics = [
    { name: 'temperature', label: 'Temperature (°C)' },
    { name: 'relative_humidity', label: 'Relative Humidity (%)' },
    { name: 'voc', label: 'VOC (ppb)' },
    { name: 'nox', label: 'NOx (ppb)' },
    { name: 'pm1', label: 'PM1 (µg/m³)' },
    { name: 'pm25', label: 'PM2.5 (µg/m³)' },
    { name: 'pm4', label: 'PM4 (µg/m³)' },
    { name: 'pm10', label: 'PM10 (µg/m³)' },
  ]

  metrics.forEach((metric) => {
    const chartDiv = document.createElement('div')
    chartContainer.value.appendChild(chartDiv)

    const margin = { top: 30, right: 30, bottom: 50, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom

    const svg = d3
      .select(chartDiv)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleTime().range([0, width])
    const y = d3.scaleLinear().range([height, 0])

    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
    svg.append('g').attr('class', 'y-axis')

    const metricData = data.map((d) => ({
      date: d.date,
      value: d[metric.name],
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
      .attr('r', 5)
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
        [width, height],
      ])
      .on('end', updateChart)

    svg.append('g').attr('class', 'brush').call(brush)

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
        .attr('r', 5)
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
      svg.select('.brush').call(brush.move, null)
    }

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text(metric.label)

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('Time')

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 10)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(metric.label)
  })
}

const parseCSV = async () => {
  const response = await fetch('/sensorData.csv')
  const text = await response.text()
  const data = d3.csvParse(text, (d) => ({
    date: d3.timeParse('%Y-%m-%d %H:%M:%S')(d.timestamp),
    temperature: +d.temperature,
    relative_humidity: +d.relative_humidity,
    voc: +d.voc,
    nox: +d.nox,
    pm1: +d.pm1,
    pm25: +d.pm25,
    pm4: +d.pm4,
    pm10: +d.pm10,
  }))
  createLineCharts(data)
}

onMounted(() => {
  parseCSV()
})
</script>

<style>
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
