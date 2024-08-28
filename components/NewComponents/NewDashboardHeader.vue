<template>
  <GeneralizedHeader
    :left-items="leftItems"
    :right-items="rightItems"
    logo-src="/vector.svg"
    logo-alt="NEU Logo"
    :show-icon="true"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useDashboardUIStore } from '@/stores/dashboardUI'

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
])
</script>
