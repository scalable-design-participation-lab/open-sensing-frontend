<!--
 * SensorHeader Component
 * 
 * This component displays the header for the sensor detail view, including
 * the sensor location, status, battery level, and navigation controls.
 * 
 * @displayName SensorHeader
 * @usage
 * <SensorHeader
 *   :selected-sensor="sensorData"
 *   @go-back="handleGoBack"
 *   @close="handleClose"
 *   @select-previous="handlePreviousSensor"
 *   @select-next="handleNextSensor"
 * />
 -->

<template>
  <header
    class="sensor-header border-b border-grey-100 p-4 flex items-center"
  >
    <UButton
      icon="i-heroicons-arrow-left"
      color="primary"
      variant="ghost"
      class="mr-2 hover:bg-gray-200"
      data-testid="go-back-button"
      @click="$emit('go-back')"
    />
    <h1
      class="text-2xl font-bold text-gray-800"
      data-testid="sensor-location"
    >
      {{ selectedSensor.location }}
    </h1>
    <UBadge
        :color="getStatusColor(selectedSensor.status)"
        class="h-5 w-5 rounded-full mx-2"
        data-testid="sensor-status"
      >
    </UBadge>
    <div class="flex-grow"></div>
    <div class="flex" data-testid="sensor-info">
      <div
        class="battery-indicator flex items-center bg-gray-100 rounded-full px-3 py-1"
        data-testid="battery-indicator"
      >
        <UIcon
          name="i-heroicons-battery-50"
          class="w-6 h-6 mr-2"
          :class="getBatteryIconColor(selectedSensor.batteryLevel)"
        />
        <span class="text-sm" data-testid="battery-level">
          {{ selectedSensor.batteryLevel }}%
        </span>
      </div>
    </div>
    <div class="navigation-buttons ml-4 flex" data-testid="navigation-buttons">
      <UButton
        icon="i-heroicons-arrow-up"
        color="primary"
        variant="ghost"
        class="mr-2 hover:bg-gray-200 transition-colors"
        data-testid="select-previous-button"
        @click="$emit('select-previous')"
      />
      <UButton
        icon="i-heroicons-arrow-down"
        color="primary"
        variant="ghost"
        class="hover:bg-gray-200 transition-colors"
        data-testid="select-next-button"
        @click="$emit('select-next')"
      />
    </div>
    <UButton
      icon="i-heroicons-x-mark"
      color="gray"
      variant="ghost"
      class="ml-4 hover:bg-gray-200 transition-colors"
      data-testid="close-button"
      @click="$emit('close')"
    />
  </header>
</template>

<script setup>
/**
 * Props for the SensorHeader component
 * @typedef {Object} SensorHeaderProps
 * @property {Object} selectedSensor - The selected sensor object
 */

/**
 * Component props
 * @type {SensorHeaderProps}
 */
defineProps({
  selectedSensor: {
    type: Object,
    required: true,
  },
})

/**
 * Emits events for navigation and closing
 */
defineEmits(['go-back', 'close', 'select-previous', 'select-next'])

/**
 * Gets the color for the status badge
 * @param {string} status - The sensor status
 * @returns {string} The color for the status badge
 */
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

/**
 * Gets the color for the battery icon
 * @param {number} value - The battery level
 * @returns {string} The CSS color class for the battery icon
 */
const getBatteryIconColor = (value) => {
  if (value < 30) return 'text-red-500'
  if (value < 70) return 'text-yellow-500'
  return 'text-green-500'
}
</script>
