<template>
  <div class="sensor-info flex-1">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Sensor Information</h2>
    <div class="info-grid grid grid-cols-2 gap-6">
      <div
        v-for="(item, index) in sensorInfoItems"
        :key="index"
        class="info-item bg-gray-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
      >
        <h3 class="text-xl font-bold" :class="item.color">
          {{ item.value }}
        </h3>
        <p class="text-sm text-gray-600 mt-2">{{ item.label }}</p>
      </div>
    </div>
    <p class="last-updated mt-4 text-sm text-gray-600">
      Last Updated: {{ formatDate(selectedSensor.timestamp) }}
    </p>
    <p class="last-maintenance mt-1 text-sm text-gray-600">
      Last Maintenance: {{ formatDate(selectedSensor.lastMaintenance) }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedSensor: {
    type: Object,
    required: true,
  },
})

const getSignalStrengthColor = (value) => {
  const strength = parseInt(value)
  if (strength <= 2) return 'text-red-500'
  if (strength <= 3) return 'text-yellow-500'
  return 'text-green-500'
}

const getAirQualityColor = (value) => {
  switch (value.toLowerCase()) {
    case 'good':
      return 'text-green-500'
    case 'moderate':
      return 'text-yellow-500'
    case 'poor':
      return 'text-orange-500'
    case 'very poor':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

const getSoilMoistureColor = (value) => {
  const moisture = parseFloat(value)
  if (moisture < 30) return 'text-red-500'
  if (moisture < 60) return 'text-yellow-500'
  return 'text-green-500'
}

const sensorInfoItems = computed(() => [
  {
    label: 'Signal Strength',
    value: `${props.selectedSensor.signalStrength}/5`,
    color: getSignalStrengthColor(props.selectedSensor.signalStrength),
  },
  {
    label: 'Air Quality',
    value: props.selectedSensor.airQuality,
    color: getAirQualityColor(props.selectedSensor.airQuality),
  },
  {
    label: 'Soil Moisture',
    value: props.selectedSensor.soilMoisture,
    color: getSoilMoistureColor(props.selectedSensor.soilMoisture),
  },
])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
@media (max-width: 480px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
