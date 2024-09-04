<template>
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    Loading...
  </div>
  <div v-else class="flex overflow-hidden flex-col h-screen">
    <NewDashboardHeader class="z-20" />

    <main class="flex-grow relative overflow-hidden">
      <MapDashboard />
      <GenericFilterSidebar
        v-if="showFilter"
        :is-visible="showFilter"
        title="Filters"
        :filter-sections="filterSections"
        class="absolute top-[100px] right-5 z-20"
        @close="closeFilter"
        @reset="resetAllFilters"
        @filter-change="handleFilterChange"
      />
      <DashboardOverlay
        :visible="showDashboard || showSensorDetail"
        class="dashboard-overlay"
      />
      <Dashboard
        v-if="showDashboard"
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[90%] h-[80%] overflow-hidden bg-transparent"
      />
      <div class="absolute left-5 top-1/2 transform -translate-y-1/2 z-20">
        <GenericToolbar :tools="sensorTools" @tool-click="handleToolClick" />
      </div>
      <SensorDetail
        v-if="showSensorDetail"
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 max-h-[95vh] overflow-hidden"
      />
    </main>
    <Footer class="z-20" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const store = useDashboardUIStore()
const {
  showFilter,
  showDashboard,
  showSensorDetail,
  dataDashboardValues,
  existingHubs,
  existingDatasets,
} = storeToRefs(store)
const {
  toggleFilter,
  resetFilters,
  updateDataDashboardValues,
  updateExistingHubs,
  updateExistingDatasets,
  updateDateRangeUpdate,
  toggleDashboard,
} = store

const isLoading = ref(false)

const filterSections = computed(() => [
  {
    name: 'location',
    label: 'Location Selection',
    icon: 'i-heroicons-map-pin',
    component: 'GenericCheckboxGroup',
    props: {
      items: Object.keys(existingHubs.value).map((hub) => ({
        label: hub,
        value: hub,
      })),
      modelValue: existingHubs.value,
    },
  },
  {
    name: 'datasets',
    label: 'Data Selection',
    icon: 'i-heroicons-chart-bar',
    component: 'GenericCheckboxGroup',
    props: {
      items: Object.keys(existingDatasets.value).map((dataset) => ({
        label: dataset,
        value: dataset,
      })),
      modelValue: existingDatasets.value,
    },
  },
  {
    name: 'datetime',
    label: 'Date & Time',
    icon: 'i-heroicons-calendar',
    component: 'GenericDateRangePicker',
    props: {
      modelValue: dataDashboardValues.value.dateRange,
      placeholder: 'Select date range',
      presetOptions: [
        { label: 'Last 24 Hours', value: 1 },
        { label: 'Last 7 Days', value: 7 },
        { label: 'Last 30 Days', value: 30 },
        { label: 'Last 365 Days', value: 365 },
      ],
    },
  },
])

const handleFilterChange = (filterData) => {
  const { name, value } = filterData
  switch (name) {
    case 'location':
      updateExistingHubs(value)
      break
    case 'datasets':
      updateExistingDatasets(value)
      break
    case 'datetime':
      updateDataDashboardValues('dateRange', value)
      break
  }
  updateDateRangeUpdate(new Date())
}

const resetAllFilters = () => {
  const resetValue = (obj) =>
    Object.fromEntries(Object.keys(obj).map((key) => [key, true]))
  updateExistingHubs(resetValue(existingHubs.value))
  updateExistingDatasets(resetValue(existingDatasets.value))
  updateDataDashboardValues('dateRange', [])
  updateDateRangeUpdate(new Date())
}

const sensorTools = [
  { icon: 'i-heroicons-home', tooltip: 'Home' },
  { icon: 'i-heroicons-funnel', tooltip: 'Filter', action: toggleFilter },
  {
    icon: 'i-heroicons-squares-2x2',
    tooltip: 'Dashboard',
    action: toggleDashboard,
  },
  { icon: 'i-heroicons-map-pin', tooltip: 'Location Info' },
]

const handleToolClick = (index: number) => {
  console.log('Dashboard: Tool clicked:', sensorTools[index].tooltip)
}

const closeFilter = () => {
  toggleFilter()
}
</script>
