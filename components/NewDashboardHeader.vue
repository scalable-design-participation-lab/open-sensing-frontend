<template>
  <GeneralizedHeader
    :left-items="leftItems"
    :right-items="rightItems"
    logo-src="/vector.svg"
    logo-alt="NEU Logo"
    :show-icon="true"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import { useAsyncData } from '#app'

const store = useDashboardUIStore()

const leftItems = ref([
  {
    label: 'Open Sensing',
    variant: 'solid',
    color: 'black',
    onClick: () => store.toggleDashboard(),
  },
])

const mapItems = [
  [
    {
      label: 'Satellite',
      icon: 'i-heroicons-globe-americas-20-solid',
      click: () => store.setMapType('satellite'),
    },
    {
      label: 'Light',
      icon: 'i-heroicons-sun-20-solid',
      click: () => store.setMapType('light'),
    },
  ],
]

const rightItems = ref([
  {
    label: 'Map Selection',
    icon: 'i-heroicons-map-20-solid',
    variant: 'outline',
    color: 'gray',
    dropdown: {
      items: mapItems,
      popper: { placement: 'bottom-end' },
    },
  },
  {
    label: 'Download',
    icon: 'i-heroicons-arrow-down-tray-20-solid',
    variant: 'outline',
    color: 'gray',
    onClick: () => emit('show-download'),
  },
])

const emit = defineEmits(['show-download'])
</script>
