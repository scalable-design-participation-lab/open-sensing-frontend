<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMapUIStore } from '../stores/mapUI'

const mapUIStore = useMapUIStore()

const leftItems = ref([
  {
    label: 'Drawing Participation',
    variant: 'solid',
    color: 'black',
    onClick: () => toggleDashboard(),
  },
  {
    label: 'Restart Ukraine',
    variant: 'solid',
    color: 'black',
  },
])

const isMapBlurred = computed(() => mapUIStore.showRegistration)

const toggleDashboard = () => {
  // 实现切换仪表板的逻辑
}
</script>

<template>
  <div class="relative">
    <NavBar />
    <BackgroundMap :class="{ 'filter blur-md': isMapBlurred }" />
    <GeneralizedHeader
      class="z-20"
      :left-items="leftItems"
      logo-src="/neu-logo.svg"
      logo-alt="Northeastern University Logo"
      :show-icon="true"
    />
    <GeneralizedFooter />
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
