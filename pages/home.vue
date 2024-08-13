<!-- home.vue -->
<template>
  <div class="home">
    <AppHeader class="app-header" />
    <main class="main-content">
      <MapSection />
      <FilterSidebar v-if="showFilter" class="filter-sidebar" />
      <DashboardOverlay :visible="showDashboard" class="dashboard-overlay" />
      <Dashboard v-if="showDashboard" class="dashboard" />
      <div class="sensor-tools-container">
        <SensorTools />
      </div>
    </main>
    <AppFooter class="app-footer" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const store = useDashboardUIStore()
const { showFilter, showDashboard } = storeToRefs(store)
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-header {
  z-index: 20;
}

.main-content {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}

.filter-sidebar {
  position: absolute;
  top: 100px;
  right: 20px;
  z-index: 20;
}

.dashboard {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  max-height: 95vh;
  overflow: hidden;
  background-color: transparent;
}

.sensor-tools-container {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
}

.app-footer {
  z-index: 20;
}
</style>
