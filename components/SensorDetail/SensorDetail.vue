<template>
  <transition
    enter-active-class="transition-opacity duration-300 ease-in-out"
    leave-active-class="transition-opacity duration-300 ease-in-out"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="showSensorDetail && selectedSensor"
      class="fixed inset-0 flex justify-center items-center z-[20]"
      data-testid="sensor-detail-modal"
      @click="closeSensorDetail"
    >
      <div
        class="w-[54%] h-[73vh] bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-[1200px] max-h-[100%] overflow-y-auto"
        data-testid="sensor-detail-content"
        @click.stop
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
                data-testid="reset-charts-button"
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
import { useSensorDetailStore } from '../../stores/sensorDetail'
import { useDashboardStore } from '../../stores/dashboard'
import { useDatasetStore } from '../../stores/datasets'
import { useSensorDataStore } from '../../stores/sensorData'
import { useResizeObserver } from '@vueuse/core'

/**
 * Store for managing sensor detail state
 * @type {import('@/stores/sensorDetail').SensorDetailStore}
 */
const sensorDetailStore = useSensorDetailStore()

/**
 * Store for managing dashboard state
 * @type {import('@/stores/dashboard').DashboardStore}
 */
const dashboardStore = useDashboardStore()

/**
 * Store for managing dataset state
 * @type {import('@/stores/datasets').DatasetStore}
 */
const datasetStore = useDatasetStore()

/**
 * Store for managing sensor data state
 * @type {import('@/stores/sensorData').SensorDataStore}
 */
const sensorDataStore = useSensorDataStore()

/**
 * Destructured reactive references from the sensor detail store
 * @type {{selectedSensor: import('vue').Ref, showSensorDetail: import('vue').Ref, sensors: import('vue').Ref}}
 */
const { selectedSensor, showSensorDetail, sensors } =
  storeToRefs(sensorDetailStore)

/**
 * Destructured reactive references from the dashboard store
 * @type {{dataDashboardValues: import('vue').Ref}}
 */
const { dataDashboardValues } = storeToRefs(dashboardStore)

/**
 * Destructured reactive references from the dataset store
 * @type {{selectedDatasets: import('vue').Ref}}
 */
const { selectedDatasets } = storeToRefs(datasetStore)

/**
 * Destructured reactive references from the sensor data store
 * @type {{sensorData: import('vue').Ref}}
 */
const { sensorData } = storeToRefs(sensorDataStore)

/**
 * Methods destructured from the sensor detail store
 * @type {{toggleSensorDetail: Function, selectNextSensor: Function, selectPreviousSensor: Function}}
 */
const { toggleSensorDetail, selectNextSensor, selectPreviousSensor } =
  sensorDetailStore

/**
 * Methods destructured from the dashboard store
 * @type {{updateDataDashboardValues: Function}}
 */
const { updateDataDashboardValues } = dashboardStore

/**
 * Methods destructured from the sensor data store
 * @type {{loadSensorData: Function}}
 */
const { loadSensorData } = sensorDataStore

/**
 * Reference to the scroll container element
 * @type {import('vue').Ref<HTMLElement | null>}
 */
const scrollContainer = ref(null)

/**
 * Width of the chart, reactive to container size changes
 * @type {import('vue').Ref<number>}
 */
const chartWidth = ref(0)

/**
 * Height of each chart
 * @type {number}
 */
const chartHeight = 180

/**
 * Global date range for all charts
 * @type {import('vue').Ref<Date[]>}
 */
const globalDateRange = ref([])

/**
 * Margin for charts
 * @type {{top: number, right: number, bottom: number, left: number}}
 */
const margin = { top: 20, right: 20, bottom: 30, left: 40 }

/**
 * Computed property to check if data is loaded and chart width is set
 * @type {import('vue').ComputedRef<boolean>}
 */
const dataLoaded = computed(
  () => Object.keys(sensorData.value).length > 0 && chartWidth.value > 0
)

/**
 * Metrics configuration for charts
 * @type {import('vue').Ref<Object>}
 */
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

/**
 * Computed property for sensor statistics
 * @type {import('vue').ComputedRef<Object>}
 */
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

/**
 * Computed property for sensor info items
 * @type {import('vue').ComputedRef<Array<{label: string, value: string, color: string}>>}
 */
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
    await loadSensorData()
  }
})

/**
 * Closes the sensor detail modal
 */
const closeSensorDetail = () => {
  toggleSensorDetail()
}

/**
 * Navigates back to the dashboard
 */
const goBackToDashboard = () => {
  toggleSensorDetail()
  dashboardStore.toggleDashboard()
}

/**
 * Updates the global date range for all charts
 * @param {Date[]} range - The new date range
 */
const updateGlobalDateRange = (range) => {
  globalDateRange.value = range
  updateDataDashboardValues('dateRange', range)
}

/**
 * Resets all charts to their initial state
 */
const resetAllCharts = () => {
  globalDateRange.value = []
  updateDataDashboardValues('dateRange', [])

  Object.keys(metrics.value).forEach((metricName) => {
    if (sensorData.value[metricName]) {
      updateDataDashboardValues(metricName, sensorData.value[metricName])
    }
  })

  chartWidth.value = chartWidth.value + 1
}

/**
 * Formats a date range into a string
 * @param {Date[]} range - The date range to format
 * @returns {string} Formatted date range string
 */
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

/**
 * Shows details for a specific stat
 * @param {string} statKey - The key of the stat to show details for
 */
const showStatDetails = (statKey) => {
  console.log(`Showing details for ${statKey}`)
}

/**
 * Gets the color for a value based on its key and value
 * @param {string} key - The key of the value
 * @param {string|number} value - The value to get the color for
 * @returns {string} The color class for the value
 */
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

/**
 * Gets the color for signal strength
 * @param {number|string} value - The signal strength value
 * @returns {string} The color class for the signal strength
 */
const getSignalStrengthColor = (value) => {
  const strength = parseInt(value)
  if (strength <= 2) return 'text-red-500'
  if (strength <= 3) return 'text-yellow-500'
  return 'text-green-500'
}

/**
 * Gets the color for air quality
 * @param {string} value - The air quality value
 * @returns {string} The color class for the air quality
 */
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

/**
 * Gets the color for soil moisture
 * @param {number|string} value - The soil moisture value
 * @returns {string} The color class for the soil moisture
 */
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
      await loadSensorData()
      resetAllCharts()
    }
  },
  { deep: true }
)

/**
 * Initializes the mini map
 * This is a placeholder function that can be overridden by parent components
 */
const initMiniMap = () => {
  console.log('Mini map initialization placeholder')
}
</script>
