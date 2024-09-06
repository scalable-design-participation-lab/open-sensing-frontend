<template>
  <UCard
    class="w-[280px] z-[1000] pointer-events-auto absolute"
    :ui="cardStyle"
    :style="positionStyle"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex gap-2">
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
        <div class="flex gap-2">
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
  const infoWidth = 280
  const infoHeight = 250

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
