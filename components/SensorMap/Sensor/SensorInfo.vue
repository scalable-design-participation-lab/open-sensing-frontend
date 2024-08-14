<template>
  <div v-if="showSensorInfo" class="sensor-info" :style="positionStyle">
    <div class="info-header">
      <span>
        <el-icon><ArrowLeftBold /></el-icon>
        <el-icon><ArrowRightBold /></el-icon>
      </span>
      <span class="arrow-icon" @click="openSensorDetail">
        <el-icon><TopRight /></el-icon>
      </span>
      <span class="close-icon" @click="closeSensorInfo">
        <el-icon><Close /></el-icon>
      </span>
    </div>
    <div class="info-divider"></div>
    <div class="info-content">
      <h3 class="sensor-title">{{ selectedSensor.location }}</h3>
      <span class="sensor-time"
        >Last updated: {{ selectedSensor.timestamp }}</span
      >
    </div>
    <p class="sensor-description">
      Temperature: {{ selectedSensor.temperature.toFixed(1) }}°C<br />
      Humidity: {{ selectedSensor.humidity.toFixed(1) }}%<br />
      Air Quality: {{ selectedSensor.airQuality }}<br />
      Battery Level: {{ selectedSensor.batteryLevel }}%
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import {
  ArrowLeftBold,
  ArrowRightBold,
  TopRight,
  Close,
} from '@element-plus/icons-vue'

const store = useDashboardUIStore()
const { selectedSensor, clickPosition, showSensorInfo } = storeToRefs(store)
const { toggleSensorDetail, closeSensorInfo } = store

const positionStyle = computed(() => {
  const { x, y } = clickPosition.value
  const offset = 10
  return {
    left: `${x + offset}px`,
    top: `${y - offset}px`,
  }
})

const openSensorDetail = () => {
  toggleSensorDetail()
  closeSensorInfo()
}
</script>

<style scoped>
.sensor-info {
  position: absolute;
  background-color: #fafafa;
  border-radius: 5px;
  padding: 13px;
  width: 227px;
  z-index: 1000;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
}

.info-header {
  display: flex;
  justify-content: space-between;
}

.arrow-icon {
  cursor: pointer;
}

.info-divider {
  height: 1px;
  background-color: #000;
  margin: 9px 0;
}

.sensor-title {
  font-size: 13px;
  font-weight: 500;
}

.sensor-time {
  font-size: 11px;
  color: #a8a8a8;
}

.sensor-description {
  font-size: 11px;
  margin-top: 12px;
}

.close-icon {
  cursor: pointer;
  margin-left: 10px;
}
</style>
