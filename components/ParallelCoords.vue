<template>
  <div id="pop-up-pcoords" class="absolute h-2/4 p-8 bg-[#004E32]">
    <h1>Summary Statistics</h1>
    <div id="pcoords" style="height: 100%; width: 100%" class="parcoords" />
  </div>
</template>

<script setup>
import 'parcoord-es/dist/parcoords.css'
import ParCoords from 'parcoord-es'
import { scaleLinear } from 'd3-scale'
import { extent } from 'd3-array'

var blue_to_brown = scaleLinear()
  .domain(extent(props.developmentsProps, (d) => d['pop20t24P']))
  .range(['steelblue', 'brown'])
// .interpolate(interpolateLab)

const props = defineProps({
  developmentsProps: Array,
})

onMounted(() => {
  var pc = ParCoords()('#pcoords')
    .data(props.developmentsProps)
    .composite('darken')
    .color(function (d) {
      return blue_to_brown(d['pop20t24P'])
    }) // quantitative color scale
    .alpha(0.35)
    .alphaOnBrushed(1)
    .brushedColor('#FFFF00')
    .render()
    .createAxes()
    .brushMode('1D-axes') // enable brushing
    .reorderable()
    .interactive() // command line mode
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
