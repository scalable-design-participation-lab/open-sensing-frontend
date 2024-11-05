<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMapUIStore } from '../stores/mapUI'

// Map store
const mapUIStore = useMapUIStore()
const { setMapType } = mapUIStore
const currentMapType = ref('light')

const leftItems = ref([
  {
    label: 'Drawing Participation',
    variant: 'solid',
    color: 'black',
  },
  {
    label: 'Гуртомá',
    variant: 'solid',
    color: 'black',
  },
])

const mapItems = [
  [
    {
      label: 'Light',
      icon: 'i-heroicons-sun-20-solid',
      click: () => setMapType('satellite'),
    },
    {
      label: 'Satellite',
      icon: 'i-heroicons-globe-americas-20-solid',
      click: () => setMapType('light'),
    },
  ],
]

const rightItems = ref([
{
    icon: 'i-heroicons-arrow-down-tray-20-solid',
    color: 'gray',
    onClick: () => (showDownloadPopup.value = true),
  },  
{
    // label: computed(() =>
    //   currentMapType.value === 'satellite'
    //     ? 'Satellite Map'
    //     : 'Vector Map'
    // ),
    icon: computed(() =>
      currentMapType.value === 'light'
        ? 'i-heroicons:map'
        : 'i-heroicons:globe-americas-20-solid'
    ),
    onClick: () => {
      currentMapType.value = currentMapType.value === 'light' ? 'satellite' : 'light';
      setMapType(currentMapType.value);
    },
  },
])

const isMapBlurred = computed(() => mapUIStore.showRegistration)
</script>

<template>
  <div class="relative">
    <NavBar class="z-30" />
    <BackgroundMap
      :class="{ 'filter blur-md': isMapBlurred }"
      :show-all-plus-icons="true"
    />
    <GeneralizedHeader
      class="z-20"
      :left-items="leftItems"
      :right-items="rightItems"
      logo-src="/neu-logo.svg"
      logo-alt="Northeastern University Logo"
      :show-icon="true"
    />
    <GeneralizedFooter class="z-20" />
    <RegistrationPopup
      :is-visible="mapUIStore.showRegistration"
      @close="mapUIStore.showRegistration = false"
    />
    <div
      v-if="isMapBlurred"
      class="absolute inset-0 bg-black bg-opacity-50 z-40"
      @click.self="mapUIStore.showRegistration = true"
    ></div>
  </div>
</template>
<style scoped>
.blur-md {
  filter: blur(8px);
}
</style>
