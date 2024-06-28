<template>
  <h1>Summary Statistics</h1>
  <div id="pcoords" ref="pcoords" class="parcoords w-full h-full" />
</template>

<script setup>
const store = useDashboardUIStore()
const { masterSolutions } = storeToRefs(store)

import * as d3 from 'd3'

const props = defineProps({
  width: { type: Number, default: 1000 },
  height: { type: Number, default: 400 },
})

const pcoords = ref(null)

const keys = ['Budget', 'Flooding', 'Outreach', 'Recruitment']
// TODO: Make this dynamic
const keyz = keys[0]

const buildParCoords = () => {
  // Specify the chart’s dimensions.
  const marginTop = 20
  const marginRight = 10
  const marginBottom = 20
  const marginLeft = 10

  // Create an horizontal (*x*) scale for each key.
  const x = new Map(
    Array.from(keys, (key) => [
      key,
      d3.scaleLinear(
        d3.extent(masterSolutions.value, (d) => d[key]),
        [marginLeft, props.width - marginRight]
      ),
    ])
  )
  // Create the vertical (*y*) scale.
  const y = d3.scalePoint(keys, [marginTop, props.height - marginBottom])

  // Create the color scale.
  const color = d3.scaleSequential(x.get(keyz).domain(), (t) =>
    d3.interpolateBrBG(1 - t)
  )

  // Create the SVG container.
  const svg = d3
    .create('svg')
    .attr('viewBox', [0, 0, props.width, props.height])
    .attr('width', props.width)
    .attr('height', props.height)
    .attr('style', 'max-width: 100%; height: auto;')

  // Append the lines.
  const line = d3
    .line()
    .defined(([, value]) => value != null)
    .x(([key, value]) => x.get(key)(value))
    .y(([key]) => y(key))

  const path = svg
    .append('g')
    .attr('fill', 'none')
    .attr('stroke-width', 1.5)
    .attr('stroke-opacity', 0.4)
    .selectAll('path')
    .data(
      masterSolutions.value
        .slice()
        .sort((a, b) => d3.ascending(a[keyz], b[keyz]))
    )
    .join('path')
    .attr('stroke', (d) => color(d[keyz]))
    .attr('d', (d) => line(d3.cross(keys, [d], (key, d) => [key, d[key]])))
    .call((path) => path.append('title').text((d) => d.SolnIndex))

  // Append the axis for each key.
  const axes = svg
    .append('g')
    .selectAll('g')
    .data(keys)
    .join('g')
    .attr('transform', (d) => `translate(0,${y(d)})`)
    .each(function (d) {
      d3.select(this).call(d3.axisBottom(x.get(d)))
    })
    .call((g) =>
      g
        .append('text')
        .attr('x', marginLeft)
        .attr('y', -6)
        .attr('text-anchor', 'start')
        .attr('fill', 'currentColor')
        .text((d) => d)
    )
    .call((g) =>
      g
        .selectAll('text')
        .clone(true)
        .lower()
        .attr('fill', 'none')
        .attr('stroke-width', 5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke', 'white')
    )

  // Create the brush behavior.
  const deselectedColor = '#ddd'
  const brushHeight = 50
  const brush = d3
    .brushX()
    .extent([
      [marginLeft, -(brushHeight / 2)],
      [props.width - marginRight, brushHeight / 2],
    ])
    .on('start brush end', brushed)

  axes.call(brush)

  const selections = new Map()

  function brushed({ selection }, key) {
    if (selection === null) selections.delete(key)
    else selections.set(key, selection.map(x.get(key).invert))
    const selected = []
    path.each(function (d) {
      const active = Array.from(selections).every(
        ([key, [min, max]]) => d[key] >= min && d[key] <= max
      )
      d3.select(this).style('stroke', active ? color(d[keyz]) : deselectedColor)
      if (active) {
        d3.select(this).raise()
        selected.push(d)
      }
    })
    svg.property('value', selected).dispatch('input')
  }

  const pcoordsObj = Object.assign(
    svg.property('value', masterSolutions.value).node(),
    {
      scales: { color },
    }
  )
  pcoords.value.append(pcoordsObj)
}

onMounted(() => {
  buildParCoords()
})
</script>

<style>
#pop-up-pcoords {
  bottom: 1.25rem;
  right: 1.25rem;
  border-radius: 1.5rem;
  width: 83.333333%;
}
</style>
