<!--
 * SensorLocation Component
 *
 * This component displays a mini map showing the location of a selected sensor.
 * It uses Mapbox GL to render an interactive map with a marker for the sensor's position.
 * The map supports navigation controls, scale display, and custom styling.
 *
 * @component
 * @example
 * <SensorLocation :selected-sensor="sensorData" />
 -->

<template>
  <div class="sensor-location flex-1">
    <h2
      class="text-xl font-bold mb-4 text-gray-800"
      data-testid="location-header"
    >
      Location
    </h2>
    <div
      id="mini-map"
      ref="miniMap"
      class="w-full h-72 rounded-lg overflow-hidden shadow-md"
      data-testid="mini-map"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

/**
 * @typedef {Object} Sensor
 * @property {[number, number]} coordinates - The [longitude, latitude] coordinates of the sensor
 */

/**
 * @type {import('vue').PropType<Sensor>}
 */
const props = defineProps({
  selectedSensor: {
    type: Object,
    required: true,
  },
})

/**
 * Reference to the mini map container element
 * @type {import('vue').Ref<HTMLElement | null>}
 */
const miniMap = ref(null)

/**
 * Mapbox GL map instance
 * @type {mapboxgl.Map | null}
 */
let map = null

/**
 * Initializes the mini map with Mapbox GL
 * @method
 */
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

/**
 * Lifecycle hook to initialize the map when the component is mounted
 * @see https://vuejs.org/api/composition-api-lifecycle.html#onmounted
 */
onMounted(() => {
  initMiniMap()
})

/**
 * Watch for changes in the selected sensor and update the map view
 * @see https://vuejs.org/api/reactivity-core.html#watch
 */
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
