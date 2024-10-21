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

      <ol-vector-layer>
        <ol-source-vector>
          <ol-feature
            v-for="sensor in sensors"
            :key="sensor.id"
            :properties="{ id: sensor.id }"
          >
            <ol-geom-point :coordinates="sensor.coordinates" />
            <ol-style>
              <ol-style-icon
                :src="getIconUrl(sensor)"
                :scale="0.5"
                :anchor="[0.5, 1]"
              />
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>

      <ol-overlay
        v-if="showSensorInfo"
        :position="selectedSensorPosition"
        :offset="[0, 0]"
        positioning="top-left"
      >
        <SensorTag :marker-position="markerPosition" />
      </ol-overlay>
    </ol-map>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSensorDetailStore } from '../../stores/sensorDetail'
import { useMapStore } from '../../stores/map'
import SensorTag from './SensorTag.vue'
import { useGeographic } from 'ol/proj'
import { click } from 'ol/events/condition'

useGeographic()

const sensorDetailStore = useSensorDetailStore()
const mapStore = useMapStore()

const { sensors, selectedSensorId, showSensorInfo } =
  storeToRefs(sensorDetailStore)
const { mapType, mapCenter } = storeToRefs(mapStore)
const { updateSelectedSensor, updateClickPosition } = sensorDetailStore
const { updateMapCenter } = mapStore

const view = ref(null)
const map = ref(null)
const projection = ref('EPSG:4326')
const markerPosition = ref({ x: 0, y: 0 })
const selectedSensorPosition = ref(null)

const initialCenter = ref([-71.0892, 42.3398])
const initialZoom = ref(18)

const mapboxToken =
  'pk.eyJ1IjoiY2VzYW5kb3ZhbDA5IiwiYSI6ImNsdHl3OXI0eTBoamkya3MzamprbmlsMTUifQ.bIy013nDKsteOtWQRZMjqw'

const mapboxUrl = computed(() => {
  const style = mapType.value === 'satellite' ? 'satellite-v9' : 'streets-v11'
  return `https://api.mapbox.com/styles/v1/mapbox/${style}/tiles/{z}/{x}/{y}@2x?access_token=${mapboxToken}`
})

const mapboxAttribution =
  '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

function getIconUrl(sensor) {
  const color =
    sensor.status === 'Active'
      ? 'green'
      : sensor.status === 'Inactive'
      ? 'red'
      : 'yellow'
  return `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`
}

function updateSensorOverlay(sensorId) {
  const sensor = sensors.value.find((s) => s.id === sensorId)
  if (sensor) {
    selectedSensorPosition.value = sensor.coordinates
  }
}

function handleMapClick(event) {
  const feature = event.map.forEachFeatureAtPixel(
    event.pixel,
    (feature) => feature
  )
  if (feature) {
    const sensorId = feature.get('id')
    if (sensorId) {
      updateSelectedSensor(sensorId)
      const coordinate = feature.getGeometry().getCoordinates()
      updateClickPosition({ x: coordinate[0], y: coordinate[1] })
      selectedSensorPosition.value = coordinate
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
    updateSensorOverlay(newId)
    if (view.value) {
      const sensor = sensors.value.find((s) => s.id === newId)
      if (sensor) {
        view.value.animate({
          center: sensor.coordinates,
          zoom: 18,
          duration: 1000,
        })
      }
    }
  }
})

onMounted(() => {
  console.log('MapDashboard mounted')
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
