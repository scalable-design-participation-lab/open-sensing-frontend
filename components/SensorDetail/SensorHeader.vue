<template>
  <header
    class="sensor-header bg-gray-100 p-4 flex items-center justify-between"
  >
    <UButton
      icon="i-heroicons-arrow-left"
      color="primary"
      variant="ghost"
      class="mr-4 hover:bg-gray-200 transition-colors"
      @click="$emit('go-back')"
    />
    <h1 class="text-2xl font-bold text-gray-800 flex-grow">
      {{ selectedSensor.location }}
    </h1>
    <div class="flex items-center space-x-4">
      <div
        class="battery-indicator flex items-center bg-gray-200 rounded-full px-3 py-1"
      >
        <UIcon
          name="i-heroicons-battery-50"
          class="w-6 h-6 mr-2"
          :class="getBatteryIconColor(selectedSensor.batteryLevel)"
        />
        <span class="text-sm font-medium"
          >{{ selectedSensor.batteryLevel }}%</span
        >
      </div>
      <UBadge
        :color="getStatusColor(selectedSensor.status)"
        class="text-sm font-medium"
      >
        {{ selectedSensor.status }}
      </UBadge>
    </div>
    <div class="navigation-buttons ml-4 flex">
      <UButton
        icon="i-heroicons-arrow-up"
        color="primary"
        variant="ghost"
        class="mr-2 hover:bg-gray-200 transition-colors"
        @click="$emit('select-previous')"
      />
      <UButton
        icon="i-heroicons-arrow-down"
        color="primary"
        variant="ghost"
        class="hover:bg-gray-200 transition-colors"
        @click="$emit('select-next')"
      />
    </div>
    <UButton
      icon="i-heroicons-x-mark"
      color="gray"
      variant="ghost"
      class="ml-4 hover:bg-gray-200 transition-colors"
      @click="$emit('close')"
    />
  </header>
</template>

<script setup>
defineProps({
  selectedSensor: {
    type: Object,
    required: true,
  },
})

defineEmits(['go-back', 'close', 'select-previous', 'select-next'])

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

const getBatteryIconColor = (value) => {
  if (value < 30) return 'text-red-500'
  if (value < 70) return 'text-yellow-500'
  return 'text-green-500'
}
</script>
