<template>
  <a-layout has-sider>
    <a-layout-sider
      :style="{
        overflow: 'auto',
        height: '100vh',
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
            @click="selectDevelopment(name)"
          >
            {{ developmentObj.name }}
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="data">
          <template #title> Data </template>
          <el-menu-item v-for="metric in sampleMetrics" :key="metric.name">
            <el-checkbox v-model="metric.checked" :label="metric.name" />
          </el-menu-item>
        </el-sub-menu>
        <el-input
          v-model="value"
          placeholder="Search by address"
          :suffix-icon="Search"
        />
        <el-checkbox
          v-model="analysisChecked"
          label="Advanced Site Analysis Mode"
        />
      </el-menu>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-header :style="{ background: 'rgb(0, 78, 50)', padding: 0 }" />
      <a-layout-content>
        <DataPopUp
          v-if="Object.keys(selectedSiteProps).length > 0"
          :dev-props="selectedSiteProps"
          @closePopUp="selectedSiteProps = {}"
        />

        <main id="main-container">
          <!-- <ParallelCoords
            v-if="analysisChecked"
            :developments-props="developmentsProps"
          /> -->
        </main>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
// IMPORTS
import { Icon } from '@iconify/vue'
import { onMounted, ref, computed } from 'vue'
import { MapboxLayer } from '@deck.gl/mapbox'
import { GeoJsonLayer } from '@deck.gl/layers'
import {
  ElMenu,
  ElSubMenu,
  ElMenuItem,
  ElSlider,
  ElRadio,
  ElRadioGroup,
  ElInput,
  ElCheckbox,
} from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

// Mapbox imports
import mapboxgl from 'mapbox-gl'
import acsNYCHA from '~/static/ACS_NYCHA_2.json'

// COMPONENTS
import DataPopUp from '~~/components/DataPopUp'
// import ParallelCoords from '~~/components/ParallelCoords'

const accessToken =
  'pk.eyJ1IjoiY3NhbmRvdmEiLCJhIjoiY2pqZWJjajY2NGxsczNrcDE0anZmY3A1MCJ9.Dq2Pukxp_L_o-j4Zz22srQ'

// Card for interaction;
const activeKey = ref([])
const searchValue = ref('')
const selectedSite = ref('')
const selectedSiteProps = ref({})
const sampleDevelopments = ref({
  HOWARD: { name: 'Howard Houses' },
  'BAY VIEW': { name: 'Bay View Houses' },
  ASTORIA: { name: 'Astoria Houses' },
  WAGNER: { name: 'Wagner Houses' },
  FOREST: { name: 'Forest Houses Farm' },
  "MARINER'S HARBOR": { name: "Mariner's Harbor Houses Farm" },
})
const sampleMetrics = ref({
  Temperature: { name: 'Temperature', units: '°F', checked: false },
  Particles: { name: 'Particulate Matter', units: 'μg/m3', checked: false },
  Humidity: { name: 'Relative Humidity', units: '%RH', checked: false },
  Moisture: { name: 'Soil Moisture', units: '% Moisture', checked: false },
  Solar: { name: 'Solar Input', units: 'Amps', checked: false },
})
const analysisChecked = ref(false)
const developmentsProps = ref([])
const state = reactive({
  selectedKeys: ['1'],
  openKeys: ['demographics'],
})

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
  let mouseLocation = false

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

    map.addLayer(
      new MapboxLayer({
        id: 'sf-geojson',
        type: GeoJsonLayer,
        data: acsNYCHA,
        pickable: true,
        stroked: false,
        filled: true,
        extruded: true,
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
  })
}
</script>

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

.interact {
  padding: 0;
  margin-top: 2%;
  position: fixed;
  right: 1.25%;
  z-index: 10;
}

.line {
  width: 100%;
  border-bottom: 1.75px solid black;
  margin-bottom: 4%;
  /*position: relative;*/
}

#components-layout-demo-fixed-sider .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.menu-title {
}
</style>
