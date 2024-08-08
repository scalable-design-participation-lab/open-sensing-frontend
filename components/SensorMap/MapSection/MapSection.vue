<template>
  <section class="map-section">
    <MapDashboard />
    <div class="map-overlay">
      <div class="sensor-tools">
        <button
          v-for="(icon, index) in sensorTools"
          :key="index"
          class="sensor-tool-button"
          :class="{ active: activeToolIndex === index }"
          @click="handleToolClick(index)"
        >
          <el-icon><component :is="icon.component" /></el-icon>
          <span class="tooltip">{{ icon.tooltip }}</span>
        </button>
      </div>
      <SensorInfo />
    </div>
    <Dashboard v-if="showDashboard" @close="closeDashboard" />
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import { House, Filter, FullScreen, Location } from '@element-plus/icons-vue'
defineOptions({
  name: 'MapSection',
})

const store = useDashboardUIStore()
const { showFilter, selectedSite } = storeToRefs(store)
const { toggleFilter, setPopUpVisibility } = store

const activeToolIndex = ref(null)
const showDashboard = ref(false)

const sensorTools = [
  { component: House, tooltip: 'Home' },
  { component: Filter, tooltip: 'Filter' },
  { component: FullScreen, tooltip: 'Dashboard' },
  { component: Location, tooltip: 'Location Info' },
]

const handleToolClick = (index) => {
  if (sensorTools[index].component === Filter) {
    toggleFilter()
  } else if (sensorTools[index].component === FullScreen) {
    openDashboard()
  } else {
    activeToolIndex.value = activeToolIndex.value === index ? null : index
  }
}

const openDashboard = () => {
  showDashboard.value = true
  setPopUpVisibility('dashboard')
}

const closeDashboard = () => {
  showDashboard.value = false
  setPopUpVisibility('dashboard')
}

watch(selectedSite, (newValue) => {
  console.log('MapSection: Selected site changed:', newValue)
})
</script>

<style scoped>
.map-section {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sensor-tools {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 15px;
  pointer-events: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.sensor-tool-button {
  width: 50px;
  height: 50px;
  margin: 8px 0;
  background-color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.sensor-tool-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.sensor-tool-button:hover .tooltip {
  display: block;
}

.sensor-tool-button.active {
  background-color: #409eff;
  color: white;
}

.sensor-tool-button .el-icon {
  font-size: 24px;
}

.tooltip {
  position: absolute;
  left: 120%;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  display: none;
  white-space: nowrap;
  pointer-events: none;
}
</style>
