<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="home">
    <AppHeader class="app-header" />
    <main class="main-content">
      <MapSection />
      <FilterSidebar v-if="showFilter" class="filter-sidebar" />
    </main>
    <AppFooter class="app-footer" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const store = useDashboardUIStore()
const { showFilter } = storeToRefs(store)
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-header {
  z-index: 10;
}

.main-content {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}

.filter-sidebar {
  position: absolute;
  top: 100px;
  right: 20px;
  z-index: 10;
}

.app-footer {
  z-index: 10;
}
</style>
