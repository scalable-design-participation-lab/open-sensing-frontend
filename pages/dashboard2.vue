<template>
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    Loading...
  </div>
  <div v-else class="flex overflow-hidden flex-col h-screen">
    <NewDashboardHeader class="app-header" />

    <main class="main-content flex-grow relative overflow-hidden">
      <MapDashboard />
      <FilterSidebar v-if="showFilter" class="filter-sidebar" />
      <DashboardOverlay
        :visible="showDashboard || showSensorDetail"
        class="dashboard-overlay"
      />
      <Dashboard v-if="showDashboard" class="dashboard-container" />
      <div class="sensor-tools-container">
        <SensorTools />
      </div>
      <SensorDetail v-if="showSensorDetail" class="sensor-detail" />
    </main>
    <Footer class="app-footer" title="Dashboard Footer" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import Footer from '@/components/FrontPage/Footer.vue'

const store = useDashboardUIStore()
const { showFilter, showDashboard, showSensorDetail } = storeToRefs(store)
</script>

<style scoped>
.main-content {
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
}

.dashboard-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  width: 90%;
  height: 80%;
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

.app-header,
.app-footer {
  z-index: 20;
}
</style>
