<template>
  <div
    id="pcoords"
    ref="pcoords"
    class="parcoords w-full h-full rounded-md"
  ></div>
</template>

<script setup>
const store = useDashboardUIStore()
const { masterSolutions } = storeToRefs(store)
const { setSelectedSolution } = store

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
  const marginRight = 30
  const marginBottom = 20
  const marginLeft = 30

  // Highlight the specie that is hovered
  const highlight = function (event, d) {
    const selectedSolution = `._${d.Budget}_${d.SolnIndex}`

    // first every group turns grey
    d3.selectAll('.line')
      .transition()
      .duration(200)
      .style('stroke', 'lightgrey')
      .style('stroke-opacity', '0.2')
    // Second the hovered specie takes its color
    d3.select(selectedSolution)
      .transition()
      .duration(200)
      .style('stroke', c(d[keyz]))
      .style('stroke-opacity', strokeOpacity)
  }

  // Unhighlight
  const doNotHighlight = function (event, d) {
    d3.selectAll('.line')
      .transition()
      .duration(200)
      .delay(200)
      .style('stroke', function (d) {
        return c(d[keyz])
      })
      .style('stroke-opacity', strokeOpacity)
  }

  // Select Solution
  const selectSolution = function (event, d) {
    d.BudgetIndex = d.Budget
    setSelectedSolution(d)
  }

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

  const brushWidth = 50
  const deselectedColor = '#ddd'
  const strokeOpacity = 0.6

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
    .attr('stroke-opacity', strokeOpacity)
    .selectAll('path')
    .data(
      masterSolutions.value
        .slice()
        .sort((a, b) => d3.ascending(a[keyz], b[keyz]))
    )
    .join('path')
    .attr('class', function (d) {
      return `line _${d.Budget}_${d.SolnIndex}`
    }) // 2 class for each line: 'line' and the solution name
    .attr('stroke', (d) => c(d[keyz]))
    .attr('d', (d) => line(d3.cross(keys, [d], (key, d) => [key, d[key]])))
    .on('click', selectSolution)
    .on('mouseover', highlight)
    .on('mouseleave', doNotHighlight)

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
        .attr('x', 0) // Adjusted for centering
        .attr('text-anchor', 'middle') // Changed from 'start' to 'middle' for centering
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
