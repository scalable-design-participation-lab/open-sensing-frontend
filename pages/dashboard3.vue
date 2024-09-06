<template>
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    Loading...
  </div>
  <div v-else class="flex overflow-hidden flex-col h-screen">
    <NewDashboardHeader
      class="app-header"
      @show-download="showDownloadPopup = true"
    />

    <main class="main-content flex-grow relative overflow-hidden">
      <MapDashboard />
      <GenericFilterSidebar
        v-if="showFilter"
        :is-visible="showFilter"
        title="Filters"
        :filter-sections="filterSections"
        class="filter-sidebar"
        @close="closeFilter"
        @reset="resetAllFilters"
        @filter-change="handleFilterChange"
      />
      <DashboardOverlay
        :visible="showDashboard || showSensorDetail"
        class="dashboard-overlay"
      />
      <Dashboard v-if="showDashboard" class="dashboard-container" />
      <div class="sensor-tools-container">
        <GenericToolbar :tools="sensorTools" @tool-click="handleToolClick" />
      </div>
      <SensorDetail v-if="showSensorDetail" class="sensor-detail" />
    </main>
    <GeneralizedFooter class="app-footer" />
    <Teleport to="body">
      <DownloadPopup
        v-if="showDownloadPopup"
        :filter-sections="downloadFilterSections"
        @close="showDownloadPopup = false"
        @download="handleDownloadData"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import { sub } from 'date-fns'

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
const selected = ref({ start: sub(new Date(), { days: 14 }), end: new Date() })
const showDownloadPopup = ref(false)
const selectedDownloadFilters = ref({})

function updateDateRange(newRange) {
  selected.value = newRange
  updateDataDashboardValues('dateRange', [newRange.start, newRange.end])
  updateDateRangeUpdate(new Date())
}

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
      modelValue: selected.value,
    },
  },
])

const downloadFilterSections = computed(() => [
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
      modelValue: selected.value,
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
      updateDateRange(value)
      break
  }
  updateDateRangeUpdate(new Date())
}

const handleDownloadFilterChange = (filterData) => {
  const { name, value } = filterData
  selectedDownloadFilters.value[name] = value
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

const handleDownloadData = async ({ filters, format }) => {
  console.log('Download options:', filters)
  console.log('File format:', format)

  try {
    const response = await $fetch('/api/download-sensor-data', {
      method: 'POST',
      body: {
        datasets: filters.datasets,
        dateRange: filters.datetime,
        location: filters.location,
        format: format,
      },
    })

    if (response) {
      // Handle download logic
      const blob = new Blob(
        [format === 'json' ? JSON.stringify(response) : response],
        {
          type: format === 'json' ? 'application/json' : 'text/csv',
        }
      )
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sensor_data.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }
  } catch (error) {
    console.error('Error downloading data:', error)
    alert(`Download failed: ${error.message || 'Unknown error'}`)
  }

  showDownloadPopup.value = false
}
</script>

<style scoped>
.main-content {
  position: relative;
  overflow: hidden;
}

.filter-sidebar {
  position: absolute;
  top: 100px;
  right: 20px;
  z-index: 20;
}

.sensor-detail {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  max-height: 95vh;
  overflow: hidden;
}

.dashboard-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  width: 90%;
  height: 80%;
  overflow: hidden;
  background-color: transparent;
}

.sensor-tools-container {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 15;
}

.app-header,
.app-footer {
  z-index: 20;
}
</style>
