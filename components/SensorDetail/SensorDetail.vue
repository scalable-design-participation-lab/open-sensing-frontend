<template>
  <transition
    enter-active-class="transition-opacity duration-300 ease-in-out"
    leave-active-class="transition-opacity duration-300 ease-in-out"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="showSensorDetail && selectedSensor"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
    >
      <div
        class="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-[1200px] max-h-[100%] overflow-y-auto"
      >
        <SensorHeader
          :selected-sensor="selectedSensor"
          @close="closeSensorDetail"
          @go-back="goBackToDashboard"
          @select-previous="selectPreviousSensor"
          @select-next="selectNextSensor"
        />
        <div class="p-6">
          <SensorStats
            :sensor-stats="sensorStats"
            @show-stat-details="showStatDetails"
          />
          <div class="flex flex-col md:flex-row gap-6 mt-8">
            <SensorInfo
              :selected-sensor="selectedSensor"
              :sensor-info-items="sensorInfoItems"
            />
            <SensorLocation
              :selected-sensor="selectedSensor"
              @init-map="initMiniMap"
            />
          </div>
          <div class="mt-8">
            <h2 class="text-xl font-bold mb-4 text-gray-800">Sensor Data</h2>
            <div
              ref="scrollContainer"
              class="h-96 overflow-y-auto border border-gray-200 rounded-lg"
            >
              <div v-if="dataLoaded" class="p-4 space-y-6">
                <LineChart
                  v-for="(metric, metricName) in metrics"
                  v-show="selectedDatasets.includes(metricName)"
                  :key="metricName"
                  :metric="metric"
                  :data="sensorData[metricName]"
                  :margin="margin"
                  :width="chartWidth"
                  :height="chartHeight"
                  @date-range-update="updateGlobalDateRange"
                />
              </div>
              <div
                v-else
                class="flex flex-col items-center justify-center h-full"
              >
                <USpinner class="mb-2" />
                <p>Loading data...</p>
              </div>
            </div>
            <div
              class="flex justify-between items-center py-4 border-t border-gray-200 mt-6"
            >
              <UButton
                color="primary"
                class="hover:bg-blue-600 transition-colors"
                @click="resetAllCharts"
              >
                Reset All Charts
              </UButton>
              <div
                v-if="globalDateRange.length === 2"
                class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
              >
                {{ formatDateRange(globalDateRange) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import { useResizeObserver } from '@vueuse/core'

const store = useDashboardUIStore()
const {
  selectedSensor,
  showSensorDetail,
  selectedDatasets,
  sensorData,
  showDashboard,
} = storeToRefs(store)

const scrollContainer = ref(null)
const chartWidth = ref(0)
const chartHeight = 180
const globalDateRange = ref([])

const margin = { top: 20, right: 20, bottom: 30, left: 40 }

const dataLoaded = computed(
  () => Object.keys(sensorData.value).length > 0 && chartWidth.value > 0
)

const metrics = ref({
  Temperature: { name: 'temperature', label: 'Temperature (°C)' },
  'Relative Humidity': {
    name: 'relative_humidity',
    label: 'Relative Humidity (%)',
  },
  'VOC (ppb)': { name: 'voc', label: 'VOC (ppb)' },
  'NOx (ppb)': { name: 'nox', label: 'NOx (ppb)' },
  pm1: { name: 'pm1', label: 'PM1 (µg/m³)' },
  'pm2.5': { name: 'pm25', label: 'PM2.5 (µg/m³)' },
  pm4: { name: 'pm4', label: 'PM4 (µg/m³)' },
  pm10: { name: 'pm10', label: 'PM10 (µg/m³)' },
})

const sensorStats = computed(() => {
  if (!selectedSensor.value) return {}
  return {
    Temperature: `${selectedSensor.value.temperature.toFixed(1)}°C`,
    Humidity: `${selectedSensor.value.humidity.toFixed(1)}%`,
    'VOC (ppb)': selectedSensor.value.voc,
    'NOx (ppb)': selectedSensor.value.nox,
    'PM2.5 (µg/m³)': selectedSensor.value.pm25,
  }
})

const sensorInfoItems = computed(() => [
  {
    label: 'Signal Strength',
    value: `${selectedSensor.value.signalStrength}/5`,
    color: getSignalStrengthColor(selectedSensor.value.signalStrength),
  },
  {
    label: 'Air Quality',
    value: selectedSensor.value.airQuality,
    color: getAirQualityColor(selectedSensor.value.airQuality),
  },
  {
    label: 'Soil Moisture',
    value: selectedSensor.value.soilMoisture,
    color: getSoilMoistureColor(selectedSensor.value.soilMoisture),
  },
])

useResizeObserver(scrollContainer, (entries) => {
  const entry = entries[0]
  if (entry) {
    chartWidth.value = entry.contentRect.width - margin.left - margin.right
  }
})

onMounted(async () => {
  if (selectedSensor.value) {
    await store.loadSensorData()
  }
})

const closeSensorDetail = () => {
  store.toggleSensorDetail()
}

const goBackToDashboard = () => {
  store.toggleSensorDetail()
  store.toggleDashboard()
}

const updateGlobalDateRange = (range) => {
  globalDateRange.value = range
  store.updateDataDashboardValues('dateRange', range)
}

const resetAllCharts = () => {
  globalDateRange.value = []
  store.updateDataDashboardValues('dateRange', [])

  Object.keys(metrics.value).forEach((metricName) => {
    if (sensorData.value[metricName]) {
      store.updateDataDashboardValues(metricName, sensorData.value[metricName])
    }
  })

  chartWidth.value = chartWidth.value + 1
}

const formatDateRange = (range) => {
  if (range.length !== 2) return ''
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    })
  }
  return `${formatDate(range[0])} - ${formatDate(range[1])}`
}

const selectNextSensor = async () => {
  await store.selectNextSensor()
  refreshSensorData()
}

const selectPreviousSensor = async () => {
  await store.selectPreviousSensor()
  refreshSensorData()
}

const refreshSensorData = async () => {
  await store.loadSensorData()
  resetAllCharts()
}

const showStatDetails = (statKey) => {
  console.log(`Showing details for ${statKey}`)
}

const getValueColor = (key, value) => {
  if (key === 'Temperature') {
    const temp = parseFloat(value)
    if (temp < 10) return 'text-blue-500'
    if (temp > 30) return 'text-red-500'
    return 'text-green-500'
  }
  if (key === 'Humidity') {
    const humidity = parseFloat(value)
    if (humidity < 30) return 'text-yellow-500'
    if (humidity > 70) return 'text-blue-500'
    return 'text-green-500'
  }
  return 'text-blue-500'
}

const getSignalStrengthColor = (value) => {
  const strength = parseInt(value)
  if (strength <= 2) return 'text-red-500'
  if (strength <= 3) return 'text-yellow-500'
  return 'text-green-500'
}

const getAirQualityColor = (value) => {
  switch (value.toLowerCase()) {
    case 'good':
      return 'text-green-500'
    case 'moderate':
      return 'text-yellow-500'
    case 'poor':
      return 'text-orange-500'
    case 'very poor':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

const getSoilMoistureColor = (value) => {
  const moisture = parseFloat(value)
  if (moisture < 30) return 'text-red-500'
  if (moisture < 60) return 'text-yellow-500'
  return 'text-green-500'
}

watch(
  selectedSensor,
  async (newSensor, oldSensor) => {
    if (newSensor && newSensor !== oldSensor) {
      await store.loadSensorData()
      resetAllCharts()
    }
  },
  { deep: true }
)
</script>
