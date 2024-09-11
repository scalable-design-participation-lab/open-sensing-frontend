<!--
 * SensorInfo Component
 * 
 * This component displays detailed information about a sensor,
 * including signal strength, air quality, soil moisture, and timestamps.
 * 
 * @displayName SensorInfo
 * @usage
 * <SensorInfo :selected-sensor="sensorData" />
 -->

<template>
  <div class="flex-1">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Sensor Information</h2>
    <div class="grid grid-cols-2 gap-6">
      <div
        v-for="(item, index) in sensorInfoItems"
        :key="index"
        class="bg-gray-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
      >
        <h3 class="text-xl font-bold" :class="item.color">
          {{ item.value }}
        </h3>
        <p class="text-sm text-gray-600 mt-2">{{ item.label }}</p>
      </div>
    </div>
    <p class="mt-4 text-sm text-gray-600">
      Last Updated: {{ formatDate(selectedSensor.timestamp) }}
    </p>
    <p class="mt-1 text-sm text-gray-600">
      Last Maintenance: {{ formatDate(selectedSensor.lastMaintenance) }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Props for the SensorInfo component
 * @typedef {Object} SensorInfoProps
 * @property {Object} selectedSensor - The selected sensor object
 */

/**
 * Component props
 * @type {SensorInfoProps}
 */
const props = defineProps({
  selectedSensor: {
    type: Object,
    required: true,
  },
})

/**
 * Gets the color for the signal strength indicator
 * @param {number|string} value - The signal strength value
 * @returns {string} The CSS color class
 */
const getSignalStrengthColor = (value) => {
  const strength = parseInt(value)
  if (strength <= 2) return 'text-red-500'
  if (strength <= 3) return 'text-yellow-500'
  return 'text-green-500'
}

/**
 * Gets the color for the air quality indicator
 * @param {string} value - The air quality value
 * @returns {string} The CSS color class
 */
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

/**
 * Gets the color for the soil moisture indicator
 * @param {string} value - The soil moisture value
 * @returns {string} The CSS color class
 */
const getSoilMoistureColor = (value) => {
  const moisture = parseFloat(value)
  if (moisture < 30) return 'text-red-500'
  if (moisture < 60) return 'text-yellow-500'
  return 'text-green-500'
}

/**
 * Computed property to generate sensor information items
 * @type {import('vue').ComputedRef<Array<{label: string, value: string, color: string}>>}
 */
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

/**
 * Formats a date string for display
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date string
 */
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
