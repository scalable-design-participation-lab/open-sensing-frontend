<!-- eslint-disable vue/multi-word-component-names -->
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

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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
      const store = useDashboardUIStore()

      try {
        // $fetch already returns parsed JSON, so we don't need to call .json()
        const data = await $fetch('/api/sensor-data')

        const metrics = {
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
        }

        const metricData = {}
        Object.keys(metrics).forEach((key) => {
          metricData[key] = data.map((d) => ({
            date: new Date(d.timestamp),
            value: d[metrics[key].name],
          }))
        })

        store.loadSensorData(metricData)
      } catch (err) {
        console.error('Error fetching sensor data', err)
      }
    },
  ],
})
</script>

<style>
body {
  font-family: 'lato', sans-serif;
}
</style>
