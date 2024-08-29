<!-- SensorTools.vue -->
<template>
  <div class="flex flex-col bg-white/90 rounded-3xl p-4 shadow-lg z-[1000]">
    <UButton
      v-for="(icon, index) in sensorTools"
      :key="index"
      :class="[
        'w-14 h-14 my-2 rounded-full transition-all duration-300 ease-in-out bg-white',
        'hover:translate-y-[-2px] hover:shadow-md hover:bg-gray-100',
        'flex items-center justify-center',
        { 'bg-blue-500 text-white': activeToolIndex === index },
      ]"
      color="white"
      variant="ghost"
      icon
      @click="handleToolClick(index)"
    >
      <UIcon
        :name="icon.component"
        class="text-2xl text-gray-800"
        :class="[
          { 'text-white': activeToolIndex === index },
          'transform translate-y-[0.5px]',
        ]"
      />
    </UButton>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const store = useDashboardUIStore()
const { showFilter, showDashboard } = storeToRefs(store)
const { toggleFilter, toggleDashboard } = store

const activeToolIndex = ref(null)

const sensorTools = [
  { component: 'i-heroicons-home', tooltip: 'Home' },
  { component: 'i-heroicons-funnel', tooltip: 'Filter' },
  { component: 'i-heroicons-squares-2x2', tooltip: 'Dashboard' },
  { component: 'i-heroicons-map-pin', tooltip: 'Location Info' },
]

const handleToolClick = (index) => {
  console.log('SensorTools: Tool clicked:', sensorTools[index].tooltip)
  if (sensorTools[index].component === 'i-heroicons-funnel') {
    toggleFilter()
  } else if (sensorTools[index].component === 'i-heroicons-squares-2x2') {
    toggleDashboard()
  } else {
    activeToolIndex.value = activeToolIndex.value === index ? null : index
  }
}
</script>
