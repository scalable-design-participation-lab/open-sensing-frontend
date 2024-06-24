<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
// IMPORTS
import { onMounted, ref } from 'vue'
import { MapboxLayer } from '@deck.gl/mapbox'
import { IconLayer, GeoJsonLayer, LineLayer } from '@deck.gl/layers'
import { center } from '@turf/center'

// Mapbox imports
import mapboxgl from 'mapbox-gl'
import acsNYCHA from '~/static/ACS_NYCHA_2.json'
import * as d3 from 'd3'

const accessToken =
  'pk.eyJ1IjoiY2VzYW5kb3ZhbDA5IiwiYSI6ImNsdHl3OXI0eTBoamkya3MzamprbmlsMTUifQ.bIy013nDKsteOtWQRZMjqw'

// Card for interaction;
const developmentsProps = ref([])

// Store
const store = useDashboardUIStore()
const { selectedSite, selectedSiteProps, development, selectedSolution } =
  storeToRefs(store)
const { updateParsedSolutions, updateSolutionsObject } = store

let map
const sampleDevelopments = {
  HOWARD: { name: 'Howard Houses' },
  'BAY VIEW': { name: 'Bay View Houses' },
  ASTORIA: { name: 'Astoria Houses' },
  WAGNER: { name: 'Wagner Houses' },
  FOREST: { name: 'Forest Houses Farm' },
  "MARINER'S HARBOR": { name: "Mariner's Harbor Houses Farm" },
}

const sampleDevelopmentsArray = Object.keys(sampleDevelopments)
let ecoHubLayer
let odLayer

onMounted(() => loadMapDraw())

watch(selectedSolution, async (newSolution) => {
  const response = await fetch(
    `/BM_${newSolution.BudgetIndex}/solution_${newSolution.SolnIndex}.csv`
  )
  const text = await response.text()
  const parsedSolutions = d3.csvParse(text, (d) => d)
  const solutionObject = {}
  parsedSolutions.forEach((d) => {
    solutionObject[parseInt(d['TDS'])] = d
  })

  updateParsedSolutions(parsedSolutions)
  updateSolutionsObject(solutionObject)

  if (ecoHubLayer !== undefined)
    ecoHubLayer.setProps({ data: getEcoHubs(solutionObject) })
  if (odLayer !== undefined && map.loaded())
    odLayer.setProps({ data: getOriginDestination(parsedSolutions) })
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

const tdsObject = {}
acsNYCHA.features.forEach((feature) => {
  tdsObject[parseInt(feature.properties['TDS_NUM'])] = feature
})

const selectDevelopment = (development) => {
  const selectedDevelopmet =
    acsNYCHA.features[devNamesIndex[development].id].geometry.coordinates.flat(
      2
    )

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
}

// loop through the features
const getEcoHubs = (selectedSolutionSites) => {
  const selectedFeatures = []
  acsNYCHA.features.filter((feature) => {
    if (selectedSolutionSites !== undefined) {
      if (
        selectedSolutionSites[parseInt(feature.properties['TDS_NUM'])][
          'HAS_ECO_HUB'
        ] === '1.0'
      ) {
        feature.properties.color = [255, 0, 0]
        selectedFeatures.push(feature)
      } else if (
        selectedSolutionSites[parseInt(feature.properties['TDS_NUM'])][
          'BUILT'
        ] === '1'
      ) {
        feature.properties.color = [0, 255, 0]
        selectedFeatures.push(feature)
      }
    } else if (
      sampleDevelopmentsArray.includes(feature.properties['DEVELOPMENT'])
    ) {
      feature.properties.color = [255, 0, 0]
      selectedFeatures.push(feature)
    }
  })
  return selectedFeatures
}

const getOriginDestination = (selectedSolutionSites) => {
  const od = []
  selectedSolutionSites.forEach((feature) => {
    // check if parseInt(feature['TDS_RECRUITMENT']) is not NaN
    if (isNaN(parseInt(feature['TDS_RECRUITMENT']))) return
    od.push({
      from: tdsObject[parseInt(feature['TDS'])],
      to: tdsObject[parseInt(feature['TDS_RECRUITMENT'])],
    })
  })
  return od
}

const loadODLayer = (data = []) => {
  // if (data.length === 0) {

  // }
  return new MapboxLayer({
    id: 'ODLayer',
    type: LineLayer,
    data: data,
    getColor: (d) => [184, 184, 184, 100],
    getSourcePosition: (d) => center(d.from).geometry.coordinates,
    getTargetPosition: (d) => center(d.to).geometry.coordinates,
    getWidth: 2,
    pickable: false,
  })
}

const loadIconLayer = (data) =>
  new MapboxLayer({
    id: 'ny-marker',
    type: IconLayer,
    data: data,
    pickable: true,
    // iconAtlas and iconMapping are required
    // getIcon: return a string
    iconAtlas:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
    iconMapping:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json',
    getIcon: (d) => 'marker',
    getPosition: (d) => center(d).geometry.coordinates,
    getSize: (d) => 40,
    getColor: (d) => d.properties.color, //(d) => [Math.sqrt(d.exits), 140, 0],
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
      [-74.1651917975229651, 40.5716103812675328],
      [-73.7311475563883505, 40.888293221510196],
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
    odLayer = loadODLayer()
    map.addLayer(odLayer)

    ecoHubLayer = loadIconLayer(getEcoHubs())
    map.addLayer(ecoHubLayer)
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
