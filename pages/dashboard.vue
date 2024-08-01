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
      v-show="dashboardLoaded && popUpVisibility.dashboard"
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
    await loadSensorData(true)
    dashboardLoaded.value = true
  }
}

let refreshInterval
const startDataRefresh = () => {
  refreshInterval = setInterval(() => {
    loadSensorData(true)
  }, 5400000)
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

  // Start data refresh
  startDataRefresh()

  // Add event listener to save state before unload
  window.addEventListener('beforeunload', saveState)
})

onUnmounted(() => {
  // Remove event listener
  window.removeEventListener('beforeunload', saveState)
  // Clear refresh interval
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style>
body {
  font-family: 'lato', sans-serif;
}
</style>
