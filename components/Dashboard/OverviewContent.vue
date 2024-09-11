<template>
  <div class="overview-content">
    <p class="text-sm text-gray-600 mb-4">{{ description }}</p>
    <div class="flex gap-3 mb-6">
      <UButton color="primary" size="sm" class="flex items-center">
        <UIcon name="i-heroicons-arrow-down-tray" class="mr-2" />
        Export
      </UButton>
      <UButton color="gray" size="sm" class="flex items-center">
        <UIcon name="i-heroicons-share" class="mr-2" />
        Share
      </UButton>
      <UButton color="gray" size="sm" class="flex items-center">
        <UIcon name="i-heroicons-pencil" class="mr-2" />
        Edit
      </UButton>
    </div>
    <div class="grid grid-cols-3 gap-4">
      <UCard
        v-for="(stat, index) in stats"
        :key="index"
        class="text-center p-4 bg-white hover:shadow-lg transition-shadow duration-300"
      >
        <h3 class="text-2xl font-bold text-blue-500">{{ stat.value }}</h3>
        <p class="text-sm text-gray-600">{{ stat.label }}</p>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Props for the OverviewContent component
 * @typedef {Object} OverviewContentProps
 * @property {string} description - The description text for the overview
 * @property {Array<{value: number, label: string}>} stats - Array of statistic objects
 */

/**
 * Component props
 * @type {OverviewContentProps}
 */
defineProps<{
  description: string
  stats: Array<{ value: number; label: string }>
}>()
</script>
