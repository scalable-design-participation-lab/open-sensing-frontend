<!--
 * SensorTag Component
 * 
 * This component displays detailed information about a selected sensor on a map.
 * It is designed to be positioned dynamically based on the sensor's location on the screen.
 * The component shows various sensor readings such as temperature, humidity, air quality,
 * and battery level, and provides navigation controls to switch between sensors.
 * 
 * @displayName SensorTag
 * @usage
 * <SensorTag
 *   :markerPosition="{ x: 100, y: 200 }"
 * />
 -->
<template>
  <UCard
    class="w-[280px] z-50 pointer-events-auto absolute"
    :ui="cardStyle"
    :style="positionStyle"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex gap-2">
          <UButton
            data-testid="previous-sensor"
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="sensorDetailStore.selectPreviousSensor"
          />
          <UButton
            data-testid="next-sensor"
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-right"
            @click="sensorDetailStore.selectNextSensor"
          />
        </div>
        <div class="flex gap-2">
          <UButton
            data-testid="open-detail"
            color="primary"
            variant="ghost"
            icon="i-heroicons-arrow-top-right-on-square"
            @click="openSensorDetail"
          />
          <UButton
            data-testid="close-info"
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="sensorDetailStore.closeSensorInfo"
          />
        </div>
      </div>
    </template>
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-1">{{ selectedSensor.location }}</h3>
      <span class="text-sm text-gray-500 block mb-4">
        Last updated: {{ selectedSensor.timestamp }}
      </span>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center">
          <UIcon name="i-heroicons-beaker" class="mr-2 text-gray-600" />
          <span>{{ selectedSensor.temperature.toFixed(1) }}°C</span>
        </div>
        <div class="flex items-center">
          <UIcon name="i-heroicons-cloud" class="mr-2 text-gray-600" />
          <span>{{ selectedSensor.humidity.toFixed(1) }}%</span>
        </div>
        <div class="flex items-center">
          <UIcon name="i-heroicons-sparkles" class="mr-2 text-gray-600" />
          <span>{{ selectedSensor.airQuality }}</span>
        </div>
        <div class="flex items-center">
          <UIcon name="i-heroicons-battery-50" class="mr-2 text-gray-600" />
          <span>{{ selectedSensor.batteryLevel }}%</span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import { useSensorDetailStore } from '../../stores/sensorDetail'

interface MarkerPosition {
  x: number
  y: number
}

const props = defineProps({
  markerPosition: {
    type: Object as PropType<MarkerPosition>,
    required: true,
  },
})

const sensorDetailStore = useSensorDetailStore()

const selectedSensor = computed(() => sensorDetailStore.selectedSensor)

const {
  toggleSensorDetail,
  closeSensorInfo,
  selectNextSensor,
  selectPreviousSensor,
} = sensorDetailStore

/**
 * Computed style for positioning the sensor tag
 * @type {import('vue').ComputedRef<{ left: string, top: string }>}
 */
const positionStyle = computed(() => {
  const { x, y } = props.markerPosition
  const offset = 10
  const infoWidth = 280
  const infoHeight = 250

  let left = x + offset
  let top = y + offset

  const { innerWidth, innerHeight } = window
  if (left + infoWidth > innerWidth) {
    left = x - infoWidth - offset
  }
  if (top + infoHeight > innerHeight) {
    top = y - infoHeight - offset
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
  }
})

/**
 * Style configuration for the card component
 * @type {Object}
 */
const cardStyle = {
  base: 'bg-white dark:bg-slate-800 shadow-lg',
  body: 'p-0',
  header: 'p-3 border-b border-gray-200 dark:border-gray-700',
}

/**
 * Opens the detailed view of the selected sensor
 */
const openSensorDetail = () => {
  sensorDetailStore.toggleSensorDetail()
}
</script>
