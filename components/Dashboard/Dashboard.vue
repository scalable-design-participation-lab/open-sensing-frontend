<!--
 * Dashboard Component
 * 
 * This is the main dashboard component that provides an overview of all sensors.
 * It includes a header with summary statistics, and a grid of SensorTile components
 * representing individual sensors. The dashboard is responsive and handles the
 * overall layout and data management for the sensor monitoring system.
 * 
 * @displayName Dashboard
 * @usage
 * <Dashboard />
 -->

<template>
  <div
    class="flex justify-center items-center min-h-screen p-[2.5vh_2.5vw] bg-[rgba(240,242,245,0.7)]"
  >
    <div
      class="w-[90%] h-[80vh] max-w-[1800px] flex flex-col gap-5 overflow-hidden"
    >
      <UCard
        class="flex-shrink-0 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <template #header>
          <DashboardHeader
            title="Sensor Overview"
            :badge-text="`Last updated: ${lastUpdated}`"
            badge-color="gray"
          />
        </template>
        <OverviewContent
          :description="overviewDescription"
          :stats="overviewStats"
        />
      </UCard>

      <div class="flex-grow overflow-y-auto p-5">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <SensorTile
            v-for="sensor in sensors"
            :key="sensor.id"
            :sensor="sensor"
            :show-details="true"
            :custom-colors="customColors"
            :display-fields="displayFields"
            class="w-full h-full"
            @open-details="openSensorDetail"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '../../stores/dashboardUI'
import SensorTile from './SensorTile.vue'
import OverviewContent from './OverviewContent.vue'
import DashboardHeader from './DashboardHeader.vue'

/**
 * Dashboard UI store instance
 * @type {import('@/stores/dashboardUI').DashboardUIStore}
 */
const store = useDashboardUIStore()

/**
 * Destructured sensors from the store
 * @type {import('vue').Ref<Array<import('@/types').Sensor>>}
 */
const { sensors } = storeToRefs(store)

/**
 * Description of the sensor data overview
 * @type {import('vue').Ref<string>}
 */
const overviewDescription = ref(
  'This dashboard provides an overview of all sensor data across the Northeastern University campus.'
)

/**
 * Computed property to get the latest update timestamp
 * @returns {string} Formatted date string of the latest update
 */
const lastUpdated = computed(() => {
  const dates = sensors.value.map((sensor) => new Date(sensor.timestamp))
  const latestDate = new Date(Math.max.apply(null, dates))
  return latestDate.toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
})

/**
 * Computed property to generate overview statistics
 * @returns {Array<{value: number, label: string}>} Array of statistic objects
 */
const overviewStats = computed(() => [
  {
    value: sensors.value.filter((sensor) => sensor.status === 'Active').length,
    label: 'Active Sensors',
  },
  {
    value: displayFields.value.length,
    label: 'Measured Values',
  },
  {
    value: sensors.value.filter((sensor) => sensor.status === 'Maintenance')
      .length,
    label: 'Pending Issues',
  },
])

/**
 * Opens the detail view for a specific sensor
 * @param {string} sensorId - The ID of the sensor to display details for
 */
const openSensorDetail = (sensorId) => {
  store.updateSelectedSensor(sensorId)
  store.toggleSensorDetail()
}

/**
 * Custom color configurations for various sensor data representations
 * @type {Object}
 */
const customColors = {
  status: {
    Active: 'green',
    Inactive: 'red',
    Maintenance: 'yellow',
  },
  battery: {
    low: 'text-red-500',
    medium: 'text-yellow-500',
    high: 'text-green-500',
  },
  values: {
    temperature: {
      '0-15': 'text-blue-500',
      '16-25': 'text-green-500',
      '26-100': 'text-red-500',
    },
    humidity: {
      '0-30': 'text-yellow-500',
      '31-70': 'text-green-500',
      '71-100': 'text-blue-500',
    },
  },
}

/**
 * List of sensor data fields to display in the tiles
 * @type {import('vue').Ref<string[]>}
 */
const displayFields = ref([
  'temperature',
  'humidity',
  'airQuality',
  'soilMoisture',
])

defineOptions({
  name: 'SensorDashboard',
})
</script>
