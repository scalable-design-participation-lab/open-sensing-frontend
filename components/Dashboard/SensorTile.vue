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
          <div class="text-center flex flex-col justify-center">
            <span class="text-xl font-bold text-blue-500"
              >{{ sensor.temperature.toFixed(1) }}°C</span
            >
            <p class="text-xs text-gray-600">Temperature</p>
          </div>
          <div class="text-center flex flex-col justify-center">
            <span class="text-xl font-bold text-blue-500"
              >{{ sensor.humidity.toFixed(1) }}%</span
            >
            <p class="text-xs text-gray-600">Humidity</p>
          </div>
          <div class="text-center flex flex-col justify-center">
            <span class="text-xl font-bold text-blue-500">{{
              sensor.airQuality
            }}</span>
            <p class="text-xs text-gray-600">Air Quality</p>
          </div>
          <div class="text-center flex flex-col justify-center">
            <span class="text-xl font-bold text-blue-500">{{
              sensor.soilMoisture
            }}</span>
            <p class="text-xs text-gray-600">Soil Moisture</p>
          </div>
        </div>
      </UCard>

      <UButton
        color="primary"
        variant="ghost"
        class="mt-4 self-center"
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

const getBatteryColor = (value) => {
  if (value < 30) return 'red'
  if (value < 70) return 'yellow'
  return 'green'
}

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
</script>

<style scoped>
.sensor-tile {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 250px; /* Adjust this value as needed */
}
</style>
