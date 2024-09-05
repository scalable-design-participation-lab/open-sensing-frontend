<template>
  <div class="sensor-location flex-1">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Location</h2>
    <div
      id="mini-map"
      ref="miniMap"
      class="w-full h-72 rounded-lg overflow-hidden shadow-md"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps({
  selectedSensor: {
    type: Object,
    required: true,
  },
})

const miniMap = ref(null)
let map = null

const initMiniMap = () => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY2VzYW5kb3ZhbDA5IiwiYSI6ImNsdHl3OXI0eTBoamkya3MzamprbmlsMTUifQ.bIy013nDKsteOtWQRZMjqw'

  map = new mapboxgl.Map({
    container: 'mini-map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: props.selectedSensor.coordinates,
    zoom: 15,
    attributionControl: false,
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  map.addControl(new mapboxgl.ScaleControl(), 'bottom-right')

  const marker = new mapboxgl.Marker({
    color: '#FF0000',
  })
    .setLngLat(props.selectedSensor.coordinates)
    .addTo(map)

  map.on('style.load', () => {
    map.setPitch(45)
    map.setBearing(20)
  })

  map.on('dblclick', () => {
    map.flyTo({
      center: props.selectedSensor.coordinates,
      zoom: 15,
      pitch: 45,
      bearing: 20,
    })
  })
}

onMounted(() => {
  initMiniMap()
})

watch(
  () => props.selectedSensor,
  (newSensor) => {
    if (map) {
      map.flyTo({
        center: newSensor.coordinates,
        zoom: 15,
        pitch: 45,
        bearing: 20,
      })
    }
  },
  { deep: true }
)
</script>
