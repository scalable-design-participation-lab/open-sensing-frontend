<script setup>
// IMPORTS
import { onMounted, ref } from 'vue'
import { MapboxLayer } from '@deck.gl/mapbox'
import { GeoJsonLayer, IconLayer } from '@deck.gl/layers'

// Mapbox imports
import mapboxgl from 'mapbox-gl'
import acsNYCHA from '~/static/ACS_NYCHA_2.json'
import Eco_Hubs from '~/static/Eco_Hubs.json'

const accessToken =
  'pk.eyJ1IjoiY3NhbmRvdmEiLCJhIjoiY2pqZWJjajY2NGxsczNrcDE0anZmY3A1MCJ9.Dq2Pukxp_L_o-j4Zz22srQ'

// Card for interaction;
const developmentsProps = ref([])

// Store
const store = useDashboardUIStore()
const { selectedSite, selectedSiteProps, development } = storeToRefs(store)

let map

onMounted(() => loadMapDraw())

watch(development, (newDevelopment) => {
  const selectedDevelopmet =
    acsNYCHA.features[
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
acsNYCHA.features.forEach((feature, index) => {
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
    bounds: [
      [-71.088492, 42.338523],
      [-71.098492, 42.348523],


    ],
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
        id: 'ny-geojson',
        type: GeoJsonLayer,
        data: acsNYCHA,
        pickable: true,
        stroked: false,
        filled: true,
        extruded: false,
        pointType: 'circle',
        lineWidthScale: 20,
        lineWidthMinPixels: 2,
        getLineColor: [0, 78, 50], //88,24,13 brown, 255,255,255 white
        getFillColor: [0, 78, 50],
        getPointRadius: 100,
        getLineWidth: 1,
        getElevation: 30,
        autoHighlight: true,
        highlightColor: [178, 235, 242, 200],
        onClick: (info) => {
          selectedSite.value = info.object.properties.CNN
          selectedSiteProps.value = info.object.properties
        },
      })
    )

    map.addLayer(
      new MapboxLayer({
        id: 'ny-marker',
        type: IconLayer,
        data: Eco_Hubs.features,
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
