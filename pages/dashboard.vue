<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
// IMPORTS
import { ref, onMounted, onUnmounted } from 'vue'
import { csv } from 'd3'
import * as d3 from 'd3'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import Dashboard from '../components/Dashboard/index.vue'

// Store
const store = useDashboardUIStore()
const { dataDashboard, selectedSiteProps, popUpVisibility } = storeToRefs(store)
const {
  setPopUpVisibility,
  updateSelectedSiteProps,
  loadSensorData,
  loadDashboardData,
} = store

// Ref to track if Dashboard data is loaded
const dashboardLoaded = ref(false)

// Function to preload Dashboard data
const preloadDashboard = async () => {
  if (!dashboardLoaded.value) {
    await loadDashboardData()
    dashboardLoaded.value = true
  }
}

// Function to save Dashboard visibility state
const saveState = () => {
  localStorage.setItem(
    'dashboardVisibility',
    JSON.stringify(popUpVisibility.value.dashboard)
  )
}

// Function to close DataPopUp
const closeDataPopUp = () => {
  updateSelectedSiteProps({})
}

onMounted(() => {
  // Restore Dashboard visibility state from localStorage
  const savedVisibility = localStorage.getItem('dashboardVisibility')
  if (savedVisibility) {
    setPopUpVisibility('dashboard')
  }

  // Start preloading Dashboard data
  preloadDashboard()

  // Add event listener to save state before unload
  window.addEventListener('beforeunload', saveState)
})

onUnmounted(() => {
  // Remove event listener
  window.removeEventListener('beforeunload', saveState)
})

definePageMeta({
  middleware: [
    async function (to, from) {
      // Custom inline middleware
      const store = useDashboardUIStore() // Get a fresh instance of the store

      const response = await fetch(
        'https://gist.githubusercontent.com/cesandoval/9e02adbb9527c367a7ae893f735e3ff3/raw/a547d333c742977926d5e877ea076528cf9b142a/sensorData.csv'
      )

      const text = await response.text()
      const data = d3.csvParse(text, (d) => {
        return {
          date: new Date(d.timestamp),
          temperature: +d.temperature,
          relative_humidity: +d.relative_humidity,
          voc: +d.voc,
          nox: +d.nox,
          pm1: +d.pm1,
          pm25: +d.pm25,
          pm4: +d.pm4,
          pm10: +d.pm10,
        }
      })

      data.sort((a, b) => a.date - b.date)

      const metrics = ref({
        Temperature: { name: 'temperature', label: 'Temperature (°C)' },
        'Relative Humidity': {
          name: 'relative_humidity',
          label: 'Relative Humidity (%)',
        },
        'VOC (ppb)': { name: 'voc', label: 'VOC (ppb)' },
        'NOx (ppb)': { name: 'nox', label: 'NOx (ppb)' },
        pm1: { name: 'pm1', label: 'PM1 (µg/m³)' },
        'pm2.5': { name: 'pm25', label: 'PM2.5 (µg/m³)' },
        pm4: { name: 'pm4', label: 'PM4 (µg/m³)' },
        pm10: { name: 'pm10', label: 'PM10 (µg/m³)' },
      })

      const metricData = {}
      Object.keys(metrics.value).forEach((key) => {
        metricData[key] = data.map((d) => ({
          date: d.date,
          value: d[metrics.value[key].name],
        }))
      })

      store.loadSensorData(metricData) // Use store.loadSensorData
    },
  ],
})
</script>

<template>
  <section>
    <NUHeader />

    <DataPopUp
      v-if="Object.keys(selectedSiteProps).length > 0"
      @close-pop-up="closeDataPopUp"
    />
    <MapDashboard v-show="!dataDashboard" />

    <Dashboard
      v-if="dashboardLoaded && popUpVisibility.dashboard"
      @close="setPopUpVisibility('dashboard')"
    />
    <About v-if="popUpVisibility.about" @close="setPopUpVisibility('about')" />

    <NUFooter />
  </section>
</template>

<style>
body {
  font-family: 'lato', sans-serif;
}
</style>
