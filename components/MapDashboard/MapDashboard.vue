<template>
  <div>
    <main id="main-container" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { MapboxLayer } from '@deck.gl/mapbox'
import { IconLayer } from '@deck.gl/layers'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import mapboxgl from 'mapbox-gl'

const accessToken =
  'pk.eyJ1IjoiY2VzYW5kb3ZhbDA5IiwiYSI6ImNsdHl3OXI0eTBoamkya3MzamprbmlsMTUifQ.bIy013nDKsteOtWQRZMjqw'

const store = useDashboardUIStore()
const { sensors, selectedSensorId } = storeToRefs(store)
const { updateSelectedSensor, updateClickPosition } = store

let map

onMounted(() => loadMapDraw())

const loadMapDraw = () => {
  mapboxgl.accessToken = accessToken

  map = new mapboxgl.Map({
    container: 'main-container',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [-71.0892, 42.3398], // Center of NEU campus
    zoom: 15,
    attributionControl: false,
  })

  map.on('load', () => {
    const ICON_MAPPING = {
      marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
    }

    map.addLayer(
      new MapboxLayer({
        id: 'sensor-markers',
        type: IconLayer,
        data: sensors.value,
        pickable: true,
        iconAtlas:
          'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
        iconMapping: ICON_MAPPING,
        getIcon: () => 'marker',
        getPosition: (d) => d.coordinates,
        getSize: () => 40,
        getColor: (d) =>
          d.status === 'Active'
            ? [0, 255, 0]
            : d.status === 'Inactive'
            ? [255, 0, 0]
            : [255, 255, 0],
        onClick: (info) => {
          if (info.object) {
            updateSelectedSensor(info.object.id)
            updateClickPosition({ x: info.x, y: info.y })
          }
        },
      })
    )
  })
}

watch(selectedSensorId, (newId) => {
  if (newId && map) {
    const sensor = sensors.value.find((s) => s.id === newId)
    if (sensor) {
      map.flyTo({
        center: sensor.coordinates,
        zoom: 17,
        duration: 1000,
      })
    }
  }
})
</script>

<style lang="postcss" scoped>
#main-container {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  flex-direction: column;
}
</style>
