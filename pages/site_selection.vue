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
      <div class="text-left text-orange-600">
Green City Force
</div>
      <a-menu
        v-model:openKeys="state.openKeys"
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        :style="{
          background: 'rgb(0, 78, 50)',
        }"
      >
        <a-sub-menu
          key="sub1"
          :style="{
            background: 'rgb(0, 78, 50)',
          }"
        >
          <template #title>
Filters
</template>

          <a-sub-menu
            key="demographics"
            :style="{
              background: 'rgb(0, 78, 50)',
            }"
          >
            <template #title>
              {{
                openKeys.includes('demographics')
                  ? 'Minimum Age Ranges'
                  : 'Demographics'
              }}
            </template>
            <a-menu-item key="min17">
              <a-slider id="min17" v-model:value="min17" :marks="marksMin17" />
            </a-menu-item>
            <a-menu-item key="min18">
              <a-slider id="min18" v-model:value="min18" :marks="marksMin18" />
            </a-menu-item>
            <a-menu-item key="demographics">
              <a-slider id="min25" v-model:value="min25" :marks="marksMin25" />
            </a-menu-item>
            <a-menu-item key="demographics">
              <a-slider id="min60" v-model:value="min60" :marks="marksMin60" />
            </a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="access">
            <template #title>
Transportation Accessibility
</template><a-menu-item key="demographics">
              <a-slider
                id="min60"
                v-model:value="rangeAccess"
                :range="rangeAccess"
                :marks="marksAccess"
                :max="75000"
              />
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="flood">
            <template #title>
Flood Risk
</template>
            <a-radio-group v-model:value="floodValue">
              <a-radio :value="1"> 10% </a-radio>
              <a-radio :value="2"> 25% </a-radio>
              <a-radio :value="3">
50%
</a-radio>
              <a-radio :value="4">
100%
</a-radio>
            </a-radio-group>
          </a-sub-menu>
          <a-sub-menu key="unbuilt">
            <template #title>
Unbuilt Area
</template>
            <a-menu-item key="unbuilt">
              <a-slider
                id="unbuilt"
                v-model:value="unbuilt"
                :marks="marksUnbuilt"
              />
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="congressional">
            Congressional District
          </a-menu-item>
          <a-menu-item key="city-council">
City Councul District
</a-menu-item>
          <a-menu-item key="food">
Food Access
</a-menu-item>
        </a-sub-menu>
        <a-sub-menu>
          <template #title>
Quick Selection
</template>
          <a-menu-item
            v-for="(developmentObj, name) in sampleDevelopments"
            :key="developmentObj.name"
            @click="selectDevelopment(name)"
          >
            {{ developmentObj.name }}
          </a-menu-item>
        </a-sub-menu>
        <a-input-search
          v-model:value="value"
          placeholder="Search by address"
          style="width: 200px, background: 'rgb(0, 78, 50)'"
          @search="onSearch"
        />
        <a-checkbox v-model:checked="analysisChecked">
          Advanced Site Analysis Mode
        </a-checkbox>
      </a-menu>
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
// // import {
//   Document,
//   Menu as IconMenu,
//   Location,
//   Setting,
// } from '@element-plus/icons-vue'
import { Layout, Menu, Slider, Radio, Checkbox } from 'ant-design-vue';


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
const analysisChecked = ref(false)
const state = reactive({
  selectedKeys: ['1'],
  openKeys: ['demographics'],
})
const min17 = ref(25)
const min18 = ref(65)
const min25 = ref(5)
const min60 = ref(5)
const rangeAccess = ref([4000, 50000])
const floodValue = ref(1)
const unbuilt = ref(4000)
const developmentsProps = ref([])
const openKeys = ref(['demographics', 'sub1'])
const value = ref('')

let map
const marksAccess = {
  [rangeAccess.value[0]]: {
    style: {
      // color: '#f50',
    },
    label: rangeAccess.value[0],
  },
  [rangeAccess.value[1]]: {
    style: {
      // color: '#f50',
    },
    label: rangeAccess.value[1],
  },
}
const marksMin17 = {
  0: {
    style: {
      // color: '#f50',
    },
    label: '0-17 years old',
  },
}
const marksMin18 = {
  0: {
    style: {
      // color: '#f50',
    },
    label: '18-24 years old',
  },
}
const marksMin25 = {
  0: {
    style: {
      // color: '#f50',
    },
    label: '25-59 years old',
  },
}
const marksMin60 = {
  0: {
    style: {
      // color: '#f50',
    },
    label: 'Above 60 years old',
  },
}
const marksUnbuilt = {
  0: {
    style: {
      // color: '#f50',
    },
    label: 'Minimum Available Area ',
  },
}

onMounted(() => loadMapDraw())

const selectedSiteURL = computed(() => {
  if (selectedSite.value !== '')
    return `https://storage.googleapis.com/localcode-sf-sites/${selectedSite.value}.jpg`
  else return ''
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

const onSearch = (searchValue) => {
  console.log('use value', searchValue)
  console.log('or use this.value', value.value)
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
