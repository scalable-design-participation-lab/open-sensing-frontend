<template>
  <!-- <main class="font-sans font-normal flex flex-col h-screen"> -->
  <header>
    <GCFHeader />
  </header>

  <section class="design-widgets">
    <SidebarNav :location="`Test Location`" class="overflow-y-scroll" />
  </section>

  <!-- Mapbox/DeckGl Canvas -->
  <section>
    <main id="main-container" class="font-sans font-normal flex flex-col h-screen"></main>
  </section>
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

<style>
html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

body {
  background-color: #fffdf8;
}

.sliders {
  right: 0px;
  bottom: 0px;
  width: calc(83.33% - 80px);
  margin: 0px 40px 24px 40px;
}

.el-slider {
  --el-slider-main-bg-color: #004700;
  --el-slider-runway-bg-color: rgba(0, 0, 0, 0.3);
  --el-slider-stop-bg-color: #84ff0e;
  --el-slider-disabled-color: var(--el-text-color-placeholder);
  --el-slider-button-size: 18px;
}
</style>
