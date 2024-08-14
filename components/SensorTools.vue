<!-- SensorTools.vue -->
<template>
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
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import { House, Filter, FullScreen, Location } from '@element-plus/icons-vue'

const store = useDashboardUIStore()
const { showFilter, showDashboard } = storeToRefs(store)
const { toggleFilter, toggleDashboard } = store

const activeToolIndex = ref(null)

const sensorTools = [
  { component: House, tooltip: 'Home' },
  { component: Filter, tooltip: 'Filter' },
  { component: FullScreen, tooltip: 'Dashboard' },
  { component: Location, tooltip: 'Location Info' },
]

const handleToolClick = (index) => {
  console.log('SensorTools: Tool clicked:', sensorTools[index].tooltip)
  if (sensorTools[index].component === Filter) {
    toggleFilter()
  } else if (sensorTools[index].component === FullScreen) {
    toggleDashboard()
  } else {
    activeToolIndex.value = activeToolIndex.value === index ? null : index
  }
}
</script>

<style scoped>
.sensor-tools {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
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
