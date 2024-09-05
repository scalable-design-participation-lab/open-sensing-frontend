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

const downloadItems = [
  [
    {
      label: 'Download CSV',
      icon: 'i-heroicons-document-arrow-down-20-solid',
      click: () => handleDownloadCSV(),
    },
    {
      label: 'Download JSON',
      icon: 'i-heroicons-document-arrow-down-20-solid',
      click: () => handleDownloadJSON(),
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
    dropdown: {
      items: downloadItems,
      popper: { placement: 'bottom-end' },
    },
  },
])

const handleDownloadCSV = () => {
  // 实现CSV下载逻辑
  console.log('Downloading CSV...')
}

const handleDownloadJSON = () => {
  // 实现JSON下载逻辑
  console.log('Downloading JSON...')
}
</script>
