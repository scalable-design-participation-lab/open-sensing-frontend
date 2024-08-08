<template>
  <div v-show="!!selectedSite" class="sensor-info" :style="positionStyle">
    <div class="info-header">
      <span>
        <el-icon><ArrowLeftBold /></el-icon>
        <el-icon><ArrowRightBold /></el-icon>
      </span>
      <span class="arrow-icon">
        <el-icon><TopRight /></el-icon>
      </span>
    </div>
    <div class="info-divider"></div>
    <div class="info-content">
      <h3 class="sensor-title">{{ selectedSite }}</h3>
      <span class="sensor-time">Last updated: {{ currentTime }}</span>
    </div>
    <p class="sensor-description">
      TDS Number: {{ selectedSiteProps.TDS_NUM || 'N/A' }}<br />
      Population (20-24): {{ selectedSiteProps.pop20t24P || 'N/A' }}<br />
      Suitable Area: {{ selectedSiteProps.suit_area || 'N/A' }}<br />
      NYCHA Area: {{ selectedSiteProps.NYCHA_Area || 'N/A' }}
    </p>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import {
  ArrowLeftBold,
  ArrowRightBold,
  TopRight,
} from '@element-plus/icons-vue'

defineOptions({
  name: 'SensorInfo',
})

const store = useDashboardUIStore()
const { selectedSite, selectedSiteProps, clickPosition } = storeToRefs(store)

const currentTime = computed(() => {
  return new Date().toLocaleString()
})

const positionStyle = computed(() => {
  const { x, y } = clickPosition.value
  const offset = 10
  return {
    left: `${x + offset}px`,
    top: `${y - offset}px`,
  }
})

watch(selectedSite, (newValue) => {
  console.log('SensorInfo: Selected site changed:', newValue)
})

watch(clickPosition, (newValue) => {
  console.log('SensorInfo: Click position changed:', newValue)
})
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
</style>
