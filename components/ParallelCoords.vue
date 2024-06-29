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

const keys = ['Budget', 'Outreach', 'Recruitment', 'Flooding']
// TODO: Make this dynamic
const keyz = keys[0]

const buildParCoords = () => {
  // Specify the chart’s dimensions.
  const marginTop = 20
  const marginRight = 10
  const marginBottom = 20
  const marginLeft = 10

  const svg = d3
    .create('svg')
    .attr('height', props.height)
    .attr('width', props.width)
    .attr('font-family', 'sans-serif')
    .attr('font-size', 12)

  const y = new Map(
    Array.from(keys, (key) => [
      key,
      d3.scaleLinear(
        d3.extent(masterSolutions.value, (d) => d[key]),
        [props.height - marginBottom, marginTop]
      ),
    ])
  )
  const x = d3.scalePoint(keys, [marginLeft, props.width - marginRight])
  const c = d3.scaleOrdinal(
    masterSolutions.value.map((d) => d[keyz]),
    d3.schemeCategory10,
    'black'
  )
  // const c = d3.scaleSequential(y.get(keyz).domain(), (t) =>
  //   d3.interpolateBrBG(1 - t)
  // )

  const brushHeight = 20
  const brushWidth = 50
  const deselectedColor = '#ddd'

  const brush = d3
    .brushY()
    .extent([
      [-(brushWidth / 2), marginTop],
      [brushWidth / 2, props.height - marginBottom],
    ])
    .on('start brush end', brushed)

  const line = d3
    .line()
    .defined(([, value]) => value != null)
    .y(([key, value]) => y.get(key)(value))
    .x(([key]) => x(key))

  const path = svg
    .append('g')
    .attr('fill', 'none')
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.4)
    .selectAll('path')
    .data(
      masterSolutions.value
        .slice()
        .sort((a, b) => d3.ascending(a[keyz], b[keyz]))
    )
    .join('path')
    .attr('stroke', (d) => c(d[keyz]))
    .attr('d', (d) => line(d3.cross(keys, [d], (key, d) => [key, d[key]])))

  path.append('title').text((d) => d.SolnIndex)

  svg
    .append('g')
    .selectAll('g')
    .data(keys)
    .join('g')
    .attr('transform', (d) => `translate(${x(d)}, 0)`)
    .each(function (d) {
      d3.select(this).call(d3.axisRight(y.get(d)))
    })
    .call((g) =>
      g
        .append('text')
        .attr('y', props.height)
        .attr('x', -6)
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
    .call(brush)

  const selections = new Map()
  function brushed({ selection }, key) {
    if (selection === null) selections.delete(key)
    else
      selections.set(
        key,
        selection.map(y.get(key).invert).sort((a, b) => a - b)
      )
    const selected = []
    path.each(function (d) {
      const active = Array.from(selections).every(
        ([key, [min, max]]) => d[key] >= min && d[key] <= max
      )

      d3.select(this).style('stroke', active ? c(d[keyz]) : deselectedColor)
      if (active) {
        d3.select(this).raise()
        selected.push(d)
      }
    })
    svg.property('value', selected).dispatch('input')
  }

  pcoords.value.append(svg.property('value', masterSolutions.value).node())
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
