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
import { useDashboardUIStore } from '@/stores/dashboardUI'
import SensorTile from './SensorTile.vue'
import OverviewContent from './OverviewContent.vue'
import DashboardHeader from './DashboardHeader.vue'

const store = useDashboardUIStore()
const { sensors } = storeToRefs(store)

const overviewDescription = ref(
  'This dashboard provides an overview of all sensor data across the Northeastern University campus.'
)

const lastUpdated = computed(() => {
  const dates = sensors.value.map((sensor) => new Date(sensor.timestamp))
  const latestDate = new Date(Math.max.apply(null, dates))
  return latestDate.toLocaleString()
})

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

const openSensorDetail = (sensorId: string) => {
  store.updateSelectedSensor(sensorId)
  store.toggleSensorDetail()
}

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

const displayFields = ref([
  'temperature',
  'humidity',
  'airQuality',
  'soilMoisture',
])

defineOptions({
  name: 'Dashboard',
})
</script>
