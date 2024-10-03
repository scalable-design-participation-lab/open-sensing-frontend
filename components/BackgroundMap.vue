<script setup>
import { onMounted } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const accessToken =
  'pk.eyJ1IjoiY2VzYW5kb3ZhbDA5IiwiYSI6ImNsdHl3OXI0eTBoamkya3MzamprbmlsMTUifQ.bIy013nDKsteOtWQRZMjqw'

const mapUIStore = useMapUIStore()

onMounted(() => {
  mapboxgl.accessToken = accessToken

  const map = new mapboxgl.Map({
    container: 'main-container',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [28.48097, 49.23278],
    zoom: 12,
    attributionControl: false,
  })

  const draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      point: false,
      line_string: false,
      polygon: false,
      trash: true,
    },
  })

  map.addControl(draw)

  map.once('load', () => {
    mapUIStore.initializeMap(map, draw)
  })
})
</script>

<template>
  <div>
    <main id="main-container" />
  </div>
</template>

<style lang="postcss" scoped>
#main-container {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  flex-direction: column;
}
</style>
