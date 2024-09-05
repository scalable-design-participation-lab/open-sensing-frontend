<template>
  <div class="sensor-stats grid grid-cols-5 gap-6">
    <div
      v-for="(value, key) in sensorStats"
      :key="key"
      class="stat-item bg-gray-100 rounded-lg p-4 text-center transform hover:scale-105 transition-transform cursor-pointer"
      @click="$emit('show-stat-details', key)"
    >
      <h3 class="text-2xl font-bold" :class="getValueColor(key, value)">
        {{ value }}
      </h3>
      <p class="text-sm text-gray-600 mt-2">{{ key }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  sensorStats: {
    type: Object,
    required: true,
  },
})

defineEmits(['show-stat-details'])

const getValueColor = (key, value) => {
  if (key === 'Temperature') {
    const temp = parseFloat(value)
    if (temp < 10) return 'text-blue-500'
    if (temp > 30) return 'text-red-500'
    return 'text-green-500'
  }
  if (key === 'Humidity') {
    const humidity = parseFloat(value)
    if (humidity < 30) return 'text-yellow-500'
    if (humidity > 70) return 'text-blue-500'
    return 'text-green-500'
  }
  return 'text-blue-500'
}
</script>

<style scoped>
@media (max-width: 1024px) {
  .sensor-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .sensor-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .sensor-stats {
    grid-template-columns: 1fr;
  }
}
</style>
