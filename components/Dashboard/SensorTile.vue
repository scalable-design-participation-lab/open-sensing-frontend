<template>
  <UCard class="sensor-tile" hover>
    <div class="flex flex-col h-full">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">
            {{ sensor.location }}
          </h3>
          <UBadge :color="getStatusColor(sensor.status)" class="mt-1">
            {{ sensor.status }}
          </UBadge>
        </div>
        <div class="flex items-center">
          <UIcon
            name="i-heroicons-battery-50"
            class="w-6 h-6 mr-1"
            :class="getBatteryIconColor(sensor.batteryLevel)"
          />
          <span class="text-sm font-semibold">{{ sensor.batteryLevel }}%</span>
        </div>
      </div>

      <UCard class="bg-gray-50 p-3 flex-grow">
        <div class="grid grid-cols-2 gap-4 text-sm h-full">
          <div
            v-for="(value, key) in sensorData"
            :key="key"
            class="text-center flex flex-col justify-center"
          >
            <span class="text-xl font-bold" :class="getValueColor(key, value)">
              {{ formatValue(key, value) }}
            </span>
            <p class="text-xs text-gray-600">{{ formatLabel(key) }}</p>
          </div>
        </div>
      </UCard>

      <UButton
        color="primary"
        variant="ghost"
        class="mt-4 self-center transition-colors duration-300 hover:bg-blue-100"
        @click="openSensorDetail"
      >
        Details
        <template #trailing>
          <UIcon name="i-heroicons-arrow-right" />
        </template>
      </UButton>
    </div>
  </UCard>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const props = defineProps({
  sensor: {
    type: Object,
    required: true,
  },
})

const store = useDashboardUIStore()

const getBatteryIconColor = (value) => {
  if (value < 30) return 'text-red-500'
  if (value < 70) return 'text-yellow-500'
  return 'text-green-500'
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'green'
    case 'Inactive':
      return 'red'
    case 'Maintenance':
      return 'yellow'
    default:
      return 'gray'
  }
}

const openSensorDetail = () => {
  store.updateSelectedSensor(props.sensor.id)
  store.toggleSensorDetail()
}

const sensorData = computed(() => ({
  temperature: props.sensor.temperature,
  humidity: props.sensor.humidity,
  airQuality: props.sensor.airQuality,
  soilMoisture: props.sensor.soilMoisture,
}))

const formatValue = (key, value) => {
  if (key === 'temperature') return `${value.toFixed(1)}°C`
  if (key === 'humidity') return `${value.toFixed(1)}%`
  return value
}

const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
}

const getValueColor = (key, value) => {
  if (key === 'temperature') {
    if (value < 10) return 'text-blue-500'
    if (value > 30) return 'text-red-500'
    return 'text-green-500'
  }
  if (key === 'humidity') {
    if (value < 30) return 'text-yellow-500'
    if (value > 70) return 'text-blue-500'
    return 'text-green-500'
  }
  return 'text-blue-500'
}
</script>

<style scoped>
.sensor-tile {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 250px;
  transition: all 0.3s ease-in-out;
}

.sensor-tile:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
