<!-- MapSection.vue -->
<template>
  <section class="map-section">
    <MapDashboard />
    <div class="map-overlay">
      <SensorInfo />
    </div>
  </section>
</template>

<script setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const store = useDashboardUIStore()
const { selectedSite } = storeToRefs(store)

watch(selectedSite, (newValue) => {
  console.log('MapSection:', newValue)
})
</script>

<style scoped>
.map-section {
  position: relative;
  width: 100%;
  height: 100vh;
  z-index: 1;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}
</style>
