<template>
  <div class="home">
    <AppHeader class="app-header" />
    <main class="main-content">
      <MapDashboard />
      <FilterSidebar v-if="showFilter" class="filter-sidebar" />
      <DashboardOverlay
        :visible="showDashboard || showSensorDetail"
        class="dashboard-overlay"
      />
      <Dashboard v-if="showDashboard" class="dashboard" />
      <div class="sensor-tools-container">
        <SensorTools />
      </div>
      <SensorInfo />
      <SensorDetail v-if="showSensorDetail" class="sensor-detail" />
    </main>
    <AppFooter class="app-footer" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

const store = useDashboardUIStore()
const { showFilter, showDashboard, showSensorDetail } = storeToRefs(store)
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
.sensor-detail {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  max-height: 95vh;
  overflow: hidden;
  background-color: transparent;
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
  z-index: 15;
}

.app-footer {
  z-index: 15;
}
</style>
