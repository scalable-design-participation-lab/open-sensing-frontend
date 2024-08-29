<template>
  <UCard class="sensor-info" :ui="cardStyle" :style="positionStyle">
    <template #header>
      <div class="info-header">
        <div class="navigation-buttons">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="selectPreviousSensor"
          />
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-right"
            @click="selectNextSensor"
          />
        </div>
        <div class="action-buttons">
          <UButton
            color="primary"
            variant="ghost"
            icon="i-heroicons-arrow-top-right-on-square"
            @click="openSensorDetail"
          />
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="closeSensorInfo"
          />
        </div>
      </div>
    </template>
    <div class="info-content">
      <h3 class="sensor-title">{{ selectedSensor.location }}</h3>
      <span class="sensor-time"
        >Last updated: {{ selectedSensor.timestamp }}</span
      >
      <div class="sensor-data">
        <div class="data-item">
          <UIcon name="i-heroicons-temperature" class="data-icon" />
          <span>{{ selectedSensor.temperature.toFixed(1) }}°C</span>
        </div>
        <div class="data-item">
          <UIcon name="i-heroicons-cloud" class="data-icon" />
          <span>{{ selectedSensor.humidity.toFixed(1) }}%</span>
        </div>
        <div class="data-item">
          <UIcon name="i-heroicons-sparkles" class="data-icon" />
          <span>{{ selectedSensor.airQuality }}</span>
        </div>
        <div class="data-item">
          <UIcon name="i-heroicons-battery-50" class="data-icon" />
          <span>{{ selectedSensor.batteryLevel }}%</span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const props = defineProps({
  markerPosition: {
    type: Object as () => { x: number; y: number },
    required: true,
  },
})

const store = useDashboardUIStore()
const { selectedSensor } = storeToRefs(store)
const {
  toggleSensorDetail,
  closeSensorInfo,
  selectNextSensor,
  selectPreviousSensor,
} = store

const positionStyle = computed(() => {
  const { x, y } = props.markerPosition
  const offset = 10
  const infoWidth = 280 // 增加宽度
  const infoHeight = 250 // 增加高度

  let left = x + offset
  let top = y - infoHeight - offset

  const { innerWidth, innerHeight } = window
  if (left + infoWidth > innerWidth) {
    left = x - infoWidth - offset
  }
  if (top < 0) {
    top = y + offset
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
    position: 'absolute',
  }
})

const cardStyle = {
  base: 'bg-white dark:bg-gray-800 shadow-lg',
  body: 'p-0',
  header: 'p-3 border-b border-gray-200 dark:border-gray-700',
}

const openSensorDetail = () => {
  toggleSensorDetail()
}
</script>

<style scoped>
.sensor-info {
  width: 280px;
  z-index: 1000;
  pointer-events: auto;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navigation-buttons,
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.info-content {
  padding: 1rem;
}

.sensor-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.sensor-time {
  font-size: 0.8rem;
  color: #6b7280;
  display: block;
  margin-bottom: 1rem;
}

.sensor-data {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.data-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.data-icon {
  margin-right: 0.5rem;
  color: #4b5563;
}
</style>
