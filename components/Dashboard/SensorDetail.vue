<template>
  <transition name="fade">
    <div
      v-if="showSensorDetail && selectedSensor"
      class="sensor-detail-overlay"
    >
      <div class="sensor-detail bg-white rounded-lg shadow-lg overflow-hidden">
        <header
          class="sensor-header bg-gray-100 p-4 flex items-center justify-between"
        >
          <UButton
            icon="i-heroicons-arrow-left"
            color="primary"
            variant="ghost"
            class="mr-4 hover:bg-gray-200 transition-colors"
            @click="goBackToDashboard"
          />
          <h1 class="text-2xl font-bold text-gray-800 flex-grow">
            {{ selectedSensor.location }}
          </h1>
          <div class="flex items-center space-x-4">
            <div
              class="battery-indicator flex items-center bg-gray-200 rounded-full px-3 py-1"
            >
              <UIcon
                :name="getBatteryIcon"
                class="w-6 h-6 mr-2"
                :class="getBatteryIconColor(selectedSensor.batteryLevel)"
              />
              <span class="text-sm font-medium"
                >{{ selectedSensor.batteryLevel }}%</span
              >
            </div>
            <UBadge
              :color="getStatusColor(selectedSensor.status)"
              class="text-sm font-medium"
            >
              {{ selectedSensor.status }}
            </UBadge>
          </div>
          <div class="navigation-buttons ml-4 flex">
            <UButton
              icon="i-heroicons-arrow-up"
              color="primary"
              variant="ghost"
              class="mr-2 hover:bg-gray-200 transition-colors"
              @click="selectPreviousSensor"
            />
            <UButton
              icon="i-heroicons-arrow-down"
              color="primary"
              variant="ghost"
              class="hover:bg-gray-200 transition-colors"
              @click="selectNextSensor"
            />
          </div>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            class="ml-4 hover:bg-gray-200 transition-colors"
            @click="closeSensorDetail"
          />
        </header>
        <div class="sensor-content p-6">
          <div class="sensor-stats grid grid-cols-5 gap-6">
            <div
              v-for="(value, key) in sensorStats"
              :key="key"
              class="stat-item bg-gray-100 rounded-lg p-4 text-center transform hover:scale-105 transition-transform cursor-pointer"
              @click="showStatDetails(key)"
            >
              <h3 class="text-2xl font-bold" :class="getValueColor(key, value)">
                {{ value }}
              </h3>
              <p class="text-sm text-gray-600 mt-2">{{ key }}</p>
            </div>
          </div>
          <div class="sensor-details flex gap-6 mt-8">
            <div class="sensor-info flex-1">
              <h2 class="text-xl font-bold mb-4 text-gray-800">
                Sensor Information
              </h2>
              <div class="info-grid grid grid-cols-2 gap-6">
                <div
                  v-for="(item, index) in sensorInfoItems"
                  :key="index"
                  class="info-item bg-gray-100 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                >
                  <h3 class="text-xl font-bold" :class="item.color">
                    {{ item.value }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-2">{{ item.label }}</p>
                </div>
              </div>
              <p class="last-updated mt-4 text-sm text-gray-600">
                Last Updated: {{ formatDate(selectedSensor.timestamp) }}
              </p>
              <p class="last-maintenance mt-1 text-sm text-gray-600">
                Last Maintenance:
                {{ formatDate(selectedSensor.lastMaintenance) }}
              </p>
            </div>
            <div class="sensor-location flex-1">
              <h2 class="text-xl font-bold mb-4 text-gray-800">Location</h2>
              <div
                id="mini-map"
                ref="miniMap"
                class="w-full h-72 rounded-lg overflow-hidden shadow-md"
              ></div>
            </div>
          </div>
          <div class="chart-container mt-8">
            <h2 class="text-xl font-bold mb-4 text-gray-800">Sensor Data</h2>
            <div
              ref="scrollContainer"
              class="scroll-container h-96 overflow-y-auto border border-gray-200 rounded-lg"
            >
              <div v-if="dataLoaded" class="charts-wrapper p-4 space-y-6">
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
                class="loading flex flex-col items-center justify-center h-full"
              >
                <USpinner class="mb-2" />
                <p>Loading data...</p>
              </div>
            </div>
            <div
              class="dashboard-footer flex justify-between items-center py-4 border-t border-gray-200 mt-6"
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
                class="date-range-display text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
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
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import LineChart from './LineChart.vue'

const store = useDashboardUIStore()
const {
  selectedSensor,
  showSensorDetail,
  selectedDatasets,
  sensorData,
  showDashboard,
} = storeToRefs(store)

const miniMap = ref(null)
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

const getStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'green'
    case 'Inactive':
      return 'red'
    case 'Maintenance':
      return 'yellow'
    default:
      return 'gray'
  }
}

const getBatteryIcon = computed(() => {
  const level = selectedSensor.value.batteryLevel
  if (level > 75) return 'i-heroicons-battery-100'
  if (level > 50) return 'i-heroicons-battery-75'
  if (level > 25) return 'i-heroicons-battery-50'
  return 'i-heroicons-battery-0'
})

const getBatteryIconColor = (value) => {
  if (value < 30) return 'text-red-500'
  if (value < 70) return 'text-yellow-500'
  return 'text-green-500'
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

useResizeObserver(scrollContainer, (entries) => {
  const entry = entries[0]
  if (entry) {
    chartWidth.value = entry.contentRect.width - margin.left - margin.right
  }
})

onMounted(async () => {
  if (selectedSensor.value) {
    initMiniMap()
    await store.loadSensorData()
  }
})

const initMiniMap = () => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY2VzYW5kb3ZhbDA5IiwiYSI6ImNsdHl3OXI0eTBoamkya3MzamprbmlsMTUifQ.bIy013nDKsteOtWQRZMjqw'

  miniMap.value = new mapboxgl.Map({
    container: 'mini-map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: selectedSensor.value.coordinates,
    zoom: 15,
    attributionControl: false,
  })

  miniMap.value.addControl(new mapboxgl.NavigationControl(), 'top-right')
  miniMap.value.addControl(new mapboxgl.ScaleControl(), 'bottom-right')

  const marker = new mapboxgl.Marker({
    color: '#FF0000',
  })
    .setLngLat(selectedSensor.value.coordinates)
    .addTo(miniMap.value)

  miniMap.value.on('style.load', () => {
    miniMap.value.setPitch(45)
    miniMap.value.setBearing(20)
  })

  miniMap.value.on('dblclick', () => {
    miniMap.value.flyTo({
      center: selectedSensor.value.coordinates,
      zoom: 15,
      pitch: 45,
      bearing: 20,
    })
  })
}

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
  if (miniMap.value) {
    miniMap.value.flyTo({
      center: selectedSensor.value.coordinates,
      zoom: 15,
      pitch: 45,
      bearing: 20,
    })
  }
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

watch(
  selectedSensor,
  async (newSensor, oldSensor) => {
    if (newSensor && newSensor !== oldSensor) {
      if (miniMap.value) {
        miniMap.value.flyTo({
          center: newSensor.coordinates,
          zoom: 15,
          pitch: 45,
          bearing: 20,
        })
      }
      await store.loadSensorData()
      resetAllCharts()
    }
  },
  { deep: true }
)
</script>

<style scoped>
.sensor-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 85%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.sensor-detail {
  width: 100%;
  max-width: 1200px;
  max-height: 100%;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media (max-width: 1024px) {
  .sensor-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .sensor-details {
    flex-direction: column;
  }
  .sensor-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .sensor-stats,
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
