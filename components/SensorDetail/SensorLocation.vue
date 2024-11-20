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
  <UCard class="flex-1">
    <template #header>
      <h2
        class="text-xl font-bold text-gray-800 dark:text-white"
        data-testid="location-header"
      >
        Location
      </h2>
    </template>

    <div
      id="mini-map"
      ref="miniMap"
      class="w-full h-72 rounded-lg overflow-hidden"
      data-testid="mini-map"
    >
      <ol-map
        v-if="hasValidCoordinates"
        :load-tiles-while-animating="true"
        :load-tiles-while-interacting="true"
        style="width: 100%; height: 100%"
      >
        <ol-view
          :center="sensorCoordinates"
          :zoom="15"
          :projection="projection"
        />

        <ol-tile-layer>
          <ol-source-xyz
            :url="mapboxUrl"
            :attributions="mapboxAttribution"
            :max-zoom="19"
            :tile-size="512"
            :tile-pixel-ratio="2"
          />
        </ol-tile-layer>

        <ol-vector-layer>
          <ol-source-vector>
            <ol-feature v-if="hasValidCoordinates">
              <ol-geom-point :coordinates="sensorCoordinates" />
              <ol-style>
                <ol-style-icon
                  src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
                  :scale="0.5"
                  :anchor="[0.5, 1]"
                />
              </ol-style>
            </ol-feature>
          </ol-source-vector>
        </ol-vector-layer>

        <ol-control-defaults />
        <ol-control-scale-line />
        <ol-control-full-screen />
      </ol-map>
      <div
        v-else
        class="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800"
      >
        <p class="text-gray-500 dark:text-gray-400">
          No location data available
        </p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGeographic } from 'ol/proj'
import type { Sensor } from '../../stores/sensorDetail'

useGeographic()

interface Props {
  selectedSensor: Sensor
}

const props = defineProps<Props>()

const projection = ref('EPSG:4326')

const mapboxToken =
  'pk.eyJ1IjoiY2VzYW5kb3ZhbDA5IiwiYSI6ImNsdHl3OXI0eTBoamkya3MzamprbmlsMTUifQ.bIy013nDKsteOtWQRZMjqw'

const mapboxUrl = computed(() => {
  return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}@2x?access_token=${mapboxToken}`
})

const mapboxAttribution =
  '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

const hasValidCoordinates = computed(() => {
  return (
    props.selectedSensor?.lon != null &&
    props.selectedSensor?.lat != null &&
    !isNaN(Number(props.selectedSensor.lon)) &&
    !isNaN(Number(props.selectedSensor.lat))
  )
})

const sensorCoordinates = computed(() => {
  if (!hasValidCoordinates.value) {
    return [-71.084671875, 42.339787500000014]
  }
  return [
    Number(props.selectedSensor.lon),
    Number(props.selectedSensor.lat),
  ] as [number, number]
})
</script>
