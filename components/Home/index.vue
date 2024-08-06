<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="home-container">
    <Header class="header-instance" />

    <MapDashboard class="map-dashboard-instance" />

    <ToolsSensors
      class="tools-sensors-instance"
      @tool-click="handleToolClick"
    />

    <ButtonHelp class="button-help-instance" @click="handleHelpClick" />

    <div class="right-toggle">
      <!-- Add content for right toggle here if needed -->
    </div>

    <LocationTag
      v-for="(location, index) in locations"
      :key="index"
      :class="`location-tag-${index + 1}`"
      :name="location.name"
      :info="location.info"
      @click="handleLocationClick(location)"
    />

    <div class="neu-logo-text-wrapper">
      <NeuLogoText class="neu-logo-text-instance" />
    </div>

    <NUFooter class="footer-instance" />

    <DataPopUp v-if="showDataPopup" @close-pop-up="closeDataPopUp" />

    <About v-if="showAbout" @close="closeAbout" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import NUHeader from '@/components/NUHeader.vue'
import MapDashboard from '@/components/MapDashboard/index.vue'
import ToolsSensors from './ToolsSensors.vue'
import ButtonHelp from './ButtonHelp.vue'
import LocationTag from './LocationTag.vue'
import NeuLogoText from './NeuLogoText.vue'
import NUFooter from '@/components/NUFooter.vue'
import DataPopUp from '@/components/DataPopUp.vue'
import About from '@/components/About.vue'

const store = useDashboardUIStore()
const { sensorData } = storeToRefs(store)

const showDataPopup = ref(false)
const showAbout = ref(false)

const locations = computed(() => {
  // Transform sensorData into location data for LocationTag components
  return Object.entries(sensorData.value).map(([key, value], index) => ({
    id: key,
    name: value.name || `Location ${index + 1}`,
    info: `Sensor ID: ${key}`,
    class: `location-tag-${index + 1}`,
  }))
})

const handleToolClick = (toolName) => {
  console.log(`Tool ${toolName} clicked`)
  // Add logic for each tool
}

const handleHelpClick = () => {
  console.log('Help button clicked')
  showAbout.value = true
}

const handleLocationClick = (location) => {
  console.log('Location clicked:', location)
  showDataPopup.value = true
  // You might want to update some state here to show relevant data in the popup
}

const closeDataPopUp = () => {
  showDataPopup.value = false
}

const closeAbout = () => {
  showAbout.value = false
}
</script>

<style scoped>
.home-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.header-instance {
  position: absolute;
  left: 172px;
  top: 59px;
  z-index: 10;
}

.map-dashboard-instance {
  width: 100%;
  height: 100%;
}

.tools-sensors-instance {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
}

.button-help-instance {
  position: absolute;
  left: 172px;
  bottom: 30px;
  z-index: 10;
}

.right-toggle {
  height: 812px;
  right: 0;
  position: absolute;
  top: 131px;
  width: 308px;
  background-color: rgba(255, 255, 255, 0.8);
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  z-index: 10;
}

.location-tag-1,
.location-tag-2,
.location-tag-3,
.location-tag-4,
.location-tag-5,
.location-tag-6 {
  position: absolute;
  z-index: 10;
}

.neu-logo-text-wrapper {
  position: absolute;
  left: 788px;
  bottom: 25px;
  z-index: 10;
}

.footer-instance {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 10;
}

/* You might need to adjust these positions based on your exact requirements */
.location-tag-1 {
  left: 450px;
  top: 607px;
}
.location-tag-2 {
  left: 615px;
  top: 641px;
}
.location-tag-3 {
  left: 1048px;
  top: 401px;
}
.location-tag-4 {
  left: 818px;
  top: 325px;
}
.location-tag-5 {
  left: 1031px;
  top: 824px;
}
.location-tag-6 {
  left: 236px;
  top: 756px;
}
</style>
