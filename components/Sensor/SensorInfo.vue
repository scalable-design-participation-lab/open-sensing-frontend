<template>
  <UCard class="sensor-info" :style="positionStyle">
    <template #header>
      <div class="info-header">
        <span>
          <UButton
            color="primary"
            variant="ghost"
            @click="selectPreviousSensor"
          >
            <UIcon name="i-heroicons-arrow-left" />
          </UButton>
          <UButton color="primary" variant="ghost" @click="selectNextSensor">
            <UIcon name="i-heroicons-arrow-right" />
          </UButton>
        </span>
        <UButton color="primary" variant="ghost" @click="openSensorDetail">
          <UIcon name="i-heroicons-arrow-top-right-on-square" />
        </UButton>
        <UButton color="gray" variant="ghost" @click="closeSensorInfo">
          <UIcon name="i-heroicons-x-mark" />
        </UButton>
      </div>
    </template>
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
  </UCard>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const props = defineProps({
  markerPosition: {
    type: Object,
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
  const infoWidth = 227 // Width of the info box
  const infoHeight = 200 // Approximate height of the info box

  // Calculate position based on marker position
  let left = x + offset
  let top = y - infoHeight - offset

  // Ensure the info box doesn't go off-screen
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

const openSensorDetail = () => {
  toggleSensorDetail()
}
</script>

<style scoped>
.sensor-info {
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

.el-icon {
  cursor: pointer;
}
</style>
