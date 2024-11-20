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
  <UCard class="flex-1">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Sensor Information
      </h3>
    </template>

    <div class="space-y-4">
      <div
        v-for="item in sensorInfoItems"
        :key="item.label"
        class="flex justify-between items-center"
      >
        <span class="text-gray-600 dark:text-gray-300">{{ item.label }}</span>
        <span :class="[item.color, 'dark:text-white']">
          {{ item.value || 'N/A' }}
        </span>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Sensor } from '../../stores/sensorDetail'

interface Props {
  selectedSensor: Sensor | null
}

const props = defineProps<Props>()

/**
 * Gets the color for signal strength
 * @param {number} value - The signal strength value
 * @returns {string} The color class for the signal strength
 */
const getSignalStrengthColor = (value: number | null): string => {
  if (value === null) return 'text-gray-500'
  if (value <= 2) return 'text-red-500'
  if (value <= 3) return 'text-yellow-500'
  return 'text-green-500'
}

/**
 * Gets the color for air quality
 * @param {string} value - The air quality value
 * @returns {string} The color class for the air quality
 */
const getAirQualityColor = (value: string | null): string => {
  if (!value) return 'text-gray-500'

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
 * Gets the air quality based on temperature and humidity
 * @param {number} temperature - The temperature value
 * @param {number} humidity - The humidity value
 * @returns {string} The air quality status
 */
const getAirQuality = (
  temperature: number | null,
  humidity: number | null
): string => {
  if (temperature === null || humidity === null) return 'Unknown'
  if (temperature === 0 && humidity === 0) return 'Inactive'
  if (temperature > 30 || humidity > 80) return 'Poor'
  if (temperature > 25 || humidity > 70) return 'Moderate'
  return 'Good'
}

const sensorInfoItems = computed(() => {
  if (!props.selectedSensor) {
    return [
      { label: 'Signal Strength', value: 'N/A', color: 'text-gray-500' },
      { label: 'Air Quality', value: 'N/A', color: 'text-gray-500' },
      { label: 'Location', value: 'N/A', color: 'text-gray-500' },
    ]
  }

  const airQuality = getAirQuality(
    props.selectedSensor.temperature,
    props.selectedSensor.relative_humidity
  )

  return [
    {
      label: 'Signal Strength',
      value: '5/5',
      color: getSignalStrengthColor(5),
    },
    {
      label: 'Air Quality',
      value: airQuality,
      color: getAirQualityColor(airQuality),
    },
    {
      label: 'Location',
      value: props.selectedSensor.ecohub_location,
      color: 'text-gray-900',
    },
  ]
})
</script>
