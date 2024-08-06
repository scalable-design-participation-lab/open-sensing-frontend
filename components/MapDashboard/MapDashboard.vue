<!-- MapDashboard.vue -->
<template>
  <div>
    <main id="main-container" />
  </div>
</template>

<script setup>
// IMPORTS
import { onMounted, ref, watch } from 'vue'
import { MapboxLayer } from '@deck.gl/mapbox'
import { IconLayer } from '@deck.gl/layers'

// Mapbox imports
import mapboxgl from 'mapbox-gl'
import sensorLocations from '~/static/Sensor_Locations_NEU.json'

const accessToken =
  'pk.eyJ1IjoiY2VzYW5kb3ZhbDA5IiwiYSI6ImNsdHl3OXI0eTBoamkya3MzamprbmlsMTUifQ.bIy013nDKsteOtWQRZMjqw'

// Card for interaction;
const developmentsProps = ref([])

// Store
const store = useDashboardUIStore()
const { selectedSite, selectedSiteProps, development } = storeToRefs(store)

let map

onMounted(() => loadMapDraw())

watch(development, (newDevelopment) => {
  const selectedDevelopmet =
    sensorLocations.features[
      devNamesIndex[newDevelopment].id
    ].geometry.coordinates.flat(2)

  // Create a 'LngLatBounds' with both corners at the first coordinate.
  const bounds = new mapboxgl.LngLatBounds(
    selectedDevelopmet[0],
    selectedDevelopmet[0]
  )
  // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
  for (const coord of selectedDevelopmet) {
    bounds.extend(coord)
  }

  map.fitBounds(bounds, {
    padding: 120,
  })
})

const devNamesIndex = {}
sensorLocations.features.forEach((feature, index) => {
  devNamesIndex[feature.properties['DEVELOPMENT']] = {
    id: index,
    tdsNum: feature.properties['TDS_NUM'],
  }
  developmentsProps.value.push(
    (({ pop20t24P, suit_area, NYCHA_Area }) => ({
      pop20t24P,
      suit_area,
      NYCHA_Area,
    }))(feature.properties)
  )
})

/***
 * Loads mapbox map and Deck.gl
 */
const loadMapDraw = () => {
  // 2) mapbox token
  mapboxgl.accessToken = accessToken

  // 3) Initialize the map
  console.log('creating map')
  map = new mapboxgl.Map({
    container: 'main-container',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-71.090953, 42.338512],
    zoom: 16.3,
    attributionControl: false,
  })

  // /* -------------------------------------------------------------------------- */
  // /*                                MAP CALLBACKS                               */
  // /* -------------------------------------------------------------------------- */

  // /* ---------------------------------- LOAD ---------------------------------- */
  map.on('load', () => {
    const firstLabelLayerId = map
      .getStyle()
      .layers.find((layer) => layer.type === 'symbol').id
    console.log('loaded.....')

    const ICON_MAPPING = {
      marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
    }

    map.addLayer(
      new MapboxLayer({
        id: 'ny-marker',
        type: IconLayer,
        data: sensorLocations.features,
        pickable: true,
        // iconAtlas and iconMapping are required
        // getIcon: return a string
        iconAtlas:
          'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
        iconMapping: ICON_MAPPING,
        getIcon: (d) => 'marker',
        getPosition: (d) => d.geometry.coordinates,
        getSize: (d) => 60,
        getColor: [255, 0, 0], //(d) => [Math.sqrt(d.exits), 140, 0],
      })
    )
  })
}
</script>

<style lang="postcss" scoped>
#main-container {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  flex-direction: column;
}
</style>
