<script setup>
// IMPORTS
import { onMounted, ref, reactive } from 'vue'
import { MapboxLayer } from '@deck.gl/mapbox'
import { GeoJsonLayer, IconLayer } from '@deck.gl/layers'
import {
  ElMenu,
  ElSubMenu,
  ElMenuItem,
  ElInput,
  ElCheckbox,
} from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

// Mapbox imports
import mapboxgl from 'mapbox-gl'
import acsNYCHA from '~/static/ACS_NYCHA_2.json'
import Eco_Hubs from '~/static/Eco_Hubs.json'

// COMPONENTS
import DataPopUp from '~~/components/DataPopUp'
// import ParallelCoords from '~~/components/ParallelCoords'

const accessToken =
  'pk.eyJ1IjoiY3NhbmRvdmEiLCJhIjoiY2pqZWJjajY2NGxsczNrcDE0anZmY3A1MCJ9.Dq2Pukxp_L_o-j4Zz22srQ'

// Card for interaction;
const selectedSite = ref('')
const selectedSiteProps = ref({})
const sampleDevelopments = reactive({
  HOWARD: { name: 'Howard Houses', checked: false },
  'BAY VIEW': { name: 'Bay View Houses', checked: false },
  ASTORIA: { name: 'Astoria Houses', checked: false },
  WAGNER: { name: 'Wagner Houses', checked: false },
  FOREST: { name: 'Forest Houses Farm', checked: false },
  "MARINER'S HARBOR": { name: "Mariner's Harbor Houses Farm", checked: false },
})
const sampleMetrics = ref({
  Temperature: { name: 'Temperature', units: '°F', checked: false },
  Particles: { name: 'Particulate Matter', units: 'μg/m3', checked: false },
  Humidity: { name: 'Relative Humidity', units: '%RH', checked: false },
  Moisture: { name: 'Soil Moisture', units: '% Moisture', checked: false },
  Solar: { name: 'Solar Input', units: 'Amps', checked: false },
})

const developmentsProps = ref([])
const address = ref('')
const dataDashboard = ref(false)

let map

onMounted(() => loadMapDraw())

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

const selectDevelopment = (development) => {
  console.log(
    development,
    sampleDevelopments[development].checked,
    sampleDevelopments
  )
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

  //
  // Extent
  // -122.5112833477207062,37.7073752682728482 : -122.3697531769701499,37.8054956996366940

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
    <div
      :style="{
        overflow: 'auto',
        height: '100vh',
        width: '200px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: 'rgb(0, 78, 50)',
      }"
    >
      <div class="text-left text-white">Green City Force</div>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        background-color="rgb(0, 78, 50)"
      >
        <el-sub-menu index="locations">
          <template #title> Locations </template>
          <el-menu-item
            v-for="(developmentObj, name) in sampleDevelopments"
            :key="developmentObj.name"
          >
            <el-checkbox
              v-model="sampleDevelopments[name].checked"
              :label="developmentObj.name"
              @change="selectDevelopment(name)"
            />
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="data">
          <template #title> Data </template>
          <el-menu-item v-for="metric in sampleMetrics" :key="metric.name">
            <el-checkbox v-model="metric.checked" :label="metric.name" />
          </el-menu-item>
        </el-sub-menu>
        <el-input
          v-model="address"
          placeholder="Search by address"
          :suffix-icon="Search"
        />
        <el-checkbox v-model="dataDashboard" label="Data Dashboard" />
      </el-menu>
    </div>
    <div :style="{ marginLeft: '200px' }">
      <div
        :style="{ height: '50px', background: 'rgb(0, 78, 50)', padding: 0 }"
      />
      <div>
        <DataPopUp
          v-if="Object.keys(selectedSiteProps).length > 0"
          :dev-props="selectedSiteProps"
          @closePopUp="selectedSiteProps = {}"
        />
        <main v-show="!dataDashboard" id="main-container" />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
html * {
  color-profile: sRGB;
  rendering-intent: auto;
  font-family: sans-serif;
}

h1 {
  font-size: 5rem;
  text-align: left;
  letter-spacing: 2px;
}

.title {
  font-size: 5rem;
}
h3 {
  margin-top: 2%;
  margin-bottom: 4%;
}

body {
  overflow: hidden;
  margin: 0;
  padding: 0;
}

#main-container {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  flex-direction: column;
}
</style>
