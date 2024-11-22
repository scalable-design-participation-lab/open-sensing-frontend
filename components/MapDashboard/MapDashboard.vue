<!--
 * MapDashboard Component
 * 
 * This component renders a map with sensor markers using Mapbox GL and deck.gl.
 * It displays sensor locations, allows interaction with sensors, and updates
 * the map based on user interactions and selected sensors.
 * 
 * @displayName MapDashboard
 * @usage
 * <MapDashboard />
 -->

<template>
  <div class="map-container">
    <ol-map
      ref="map"
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      style="width: 100%; height: 100vh"
      :controls="[]"
      @click="handleMapClick"
      @moveend="updateSelectedSensorOverlay"
    >
      <ol-view
        ref="view"
        :center="initialCenter"
        :zoom="initialZoom"
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

      <ol-vector-layer v-if="formattedSensors.length > 0">
        <ol-source-vector>
          <ol-feature
            v-for="sensor in formattedSensors"
            :key="sensor.moduleid"
            :properties="{ id: sensor.moduleid }"
          >
            <ol-geom-point :coordinates="sensor.coordinates" />
            <ol-style>
              <ol-style-icon
                :src="getIconUrl(sensor)"
                :scale="0.06"
                :anchor="[0.5, 0.9]"
              />
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>

      <ol-overlay
        v-if="showSensorInfo && selectedSensorPosition"
        :position="selectedSensorPosition"
        :offset="[0, 0]"
        positioning="top-left"
      >
        <SensorTag :marker-position="markerPosition" />
      </ol-overlay>
    </ol-map>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSensorDetailStore } from '../../stores/sensorDetail'
import { useMapStore } from '../../stores/map'
import SensorTag from './SensorTag.vue'
import { useGeographic } from 'ol/proj'
import type { Sensor } from '../../stores/sensorDetail'
import * as turf from '@turf/turf'
import * as d3 from 'd3'
import type { View } from 'ol'

useGeographic()

interface FormattedSensor {
  moduleid: string
  coordinates: [number, number]
  status: string
  ecohub_location: string
  temperature: number
}

const sensorDetailStore = useSensorDetailStore()
const mapStore = useMapStore()

const { sensors, selectedSensorId, showSensorInfo, selectedSensor } =
  storeToRefs(sensorDetailStore)
const { mapType } = storeToRefs(mapStore)
const { updateSelectedSensor, updateClickPosition } = sensorDetailStore

const view = ref<View | null>(null)
const map = ref(null)
const projection = ref('EPSG:4326')
const markerPosition = ref({ x: 0, y: 0 })
const selectedSensorPosition = ref<[number, number] | null>(null)

const initialCenter = ref([-71.084671875, 42.339787500000014])
const initialZoom = ref(18)

const mapboxToken =
  'pk.eyJ1IjoiY2VzYW5kb3ZhbDA5IiwiYSI6ImNsdHl3OXI0eTBoamkya3MzamprbmlsMTUifQ.bIy013nDKsteOtWQRZMjqw'

const mapboxUrl = computed(() => {
  const style = mapType.value === 'satellite' ? 'satellite-v9' : 'streets-v11'
  return `https://api.mapbox.com/styles/v1/mapbox/${style}/tiles/{z}/{x}/{y}@2x?access_token=${mapboxToken}`
})

const mapboxAttribution =
  '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

const formattedSensors = computed(() => {
  if (
    !sensorDetailStore.filteredSensors ||
    !Array.isArray(sensorDetailStore.filteredSensors)
  ) {
    console.log('No valid sensors data')
    return []
  }

  return sensorDetailStore.filteredSensors
    .filter((sensor: Sensor) => {
      const hasValidCoords =
        sensor?.lon != null &&
        sensor?.lat != null &&
        !isNaN(Number(sensor.lon)) &&
        !isNaN(Number(sensor.lat))

      if (!hasValidCoords) {
        console.log('Sensor without valid coordinates:', sensor?.moduleid)
      }
      return hasValidCoords
    })
    .map((sensor: Sensor) => {
      const lon = Number(sensor.lon)
      const lat = Number(sensor.lat)
      const coordinates = [lon, lat] as [number, number]

      return {
        moduleid: sensor.moduleid,
        coordinates,
        status:
          sensor.temperature === 0 && sensor.relative_humidity === 0
            ? 'Inactive'
            : 'Active',
        ecohub_location: sensor.ecohub_location,
        temperature: sensor.temperature,
      }
    })
})

function createColoredLocationIcon(color: string) {
  const svgContent = `<?xml version="1.0" encoding="utf-8"?>
    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" 
        stroke="#000000" 
        stroke-width="1" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        fill="${color}" 
        fill-opacity="1"/>
      <circle 
        cx="12" 
        cy="10" 
        r="2.5" 
        fill="white"  
        stroke="#000000" 
        stroke-width="1"/>
    </svg>`

  return (
    'data:image/svg+xml;base64,' +
    btoa(unescape(encodeURIComponent(svgContent)))
  )
}

function getIconUrl(sensor: FormattedSensor) {
  if (sensor.status === 'Inactive') {
    return createColoredLocationIcon('#D3D3D3') // Light grey fill for inactive sensors
  }

  const temp = sensor.temperature

  // Create a color interpolator for temperature range -20 to 30 degrees
  const tempScale = d3
    .scaleLinear()
    .domain([-20, 30]) // temperature range
    .range([0, 1]) // map to 0-1 interval

  // Create gradient colors using interpolateRgbBasis
  const colorInterpolator = d3.interpolateRgbBasis([
    '#0000FF', // blue for cold
    '#00FF00', // green for medium
    '#FF0000', // red for hot
  ])

  const normalizedTemp = tempScale(temp)
  const color =
    d3.color(colorInterpolator(normalizedTemp))?.formatHex() || '#808080'

  return createColoredLocationIcon(color)
}

function updateSensorOverlay(sensorId: string) {
  const sensor = formattedSensors.value.find((s) => s.moduleid === sensorId)
  if (sensor?.coordinates) {
    console.log('Updating sensor overlay position:', sensor.coordinates)

    selectedSensorPosition.value = [...sensor.coordinates] as [number, number]
  }
}

function handleMapClick(event: any) {
  const feature = event.map.forEachFeatureAtPixel(
    event.pixel,
    (feature: any) => feature
  )

  if (feature) {
    const sensorId = feature.get('id')
    if (sensorId) {
      console.log('Clicked sensor:', sensorId)
      const coordinate = feature.getGeometry().getCoordinates()

      if (Array.isArray(coordinate) && coordinate.length === 2) {
        console.log('Clicked coordinates:', coordinate)
        updateSelectedSensor(sensorId)
        updateClickPosition({ x: coordinate[0], y: coordinate[1] })
        selectedSensorPosition.value = [...coordinate] as [number, number]
      }
    }
  } else {
    sensorDetailStore.closeSensorInfo()
  }
}

function updateSelectedSensorOverlay(event) {
  if (selectedSensorId.value && event.map) {
    updateSensorOverlay(selectedSensorId.value)
  }
}

watch(selectedSensorId, (newId) => {
  if (newId) {
    console.log('Selected sensor changed:', newId)
    updateSensorOverlay(newId)
    if (view.value) {
      const sensor = formattedSensors.value.find((s) => s.moduleid === newId)
      if (sensor) {
        console.log('Animating to sensor:', sensor.coordinates)
        view.value.animate({
          center: sensor.coordinates,
          zoom: 18,
          duration: 1000,
        })
      }
    }
  }
})

const calculateMapBounds = computed(() => {
  if (!formattedSensors.value || formattedSensors.value.length === 0) {
    return {
      center: initialCenter.value,
      zoom: initialZoom.value,
    }
  }

  try {
    const features = formattedSensors.value.map((sensor) => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: sensor.coordinates,
      },
    }))

    const collection = turf.featureCollection(features)
    const bbox = turf.bbox(collection)

    const center = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2]

    return {
      center,
      zoom: 18,
    }
  } catch (error) {
    console.error('Error calculating map bounds:', error)
    return {
      center: initialCenter.value,
      zoom: initialZoom.value,
    }
  }
})

// Update the view when sensors are loaded
watch(formattedSensors, (newSensors) => {
  if (newSensors.length > 0 && view.value) {
    const { center, zoom } = calculateMapBounds.value
    view.value.animate({
      center,
      zoom,
      duration: 1000,
    })
  }
})

onMounted(async () => {
  console.log('MapDashboard mounted')
  await sensorDetailStore.loadSensors()

  console.log('Formatted sensors:', formattedSensors.value)
})
</script>

<style scoped>
.map-container {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  flex-direction: column;
}
</style>
