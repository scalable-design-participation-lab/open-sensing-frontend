<template>
  <UModal v-model="showSensorDetail" :ui="{ width: 'max-w-5xl' }">
    <UCard v-if="selectedSensor" class="sensor-detail">
      <template #header>
        <div class="sensor-header">
          <UButton color="primary" variant="ghost" @click="goBackToDashboard">
            <UIcon name="i-heroicons-arrow-left" />
          </UButton>
          <h1>{{ selectedSensor.location }}</h1>
          <UBadge :color="getStatusColor(selectedSensor.status)">
            {{ selectedSensor.status }}
          </UBadge>
          <div class="navigation-buttons">
            <UButton
              color="primary"
              variant="ghost"
              @click="selectPreviousSensor"
            >
              <UIcon name="i-heroicons-arrow-up" />
            </UButton>
            <UButton color="primary" variant="ghost" @click="selectNextSensor">
              <UIcon name="i-heroicons-arrow-down" />
            </UButton>
          </div>
          <UButton color="gray" variant="ghost" @click="closeSensorDetail">
            <UIcon name="i-heroicons-x-mark" />
          </UButton>
        </div>
      </template>
      <div class="sensor-content">
        <UGrid :cols="5" class="sensor-stats">
          <UCard
            v-for="(value, key) in sensorStats"
            :key="key"
            class="stat-item"
          >
            <h3>{{ value }}</h3>
            <p>{{ key }}</p>
          </UCard>
        </UGrid>
        <UGrid :cols="2" class="sensor-details">
          <div class="sensor-info">
            <h2>Sensor Information</h2>
            <UGrid :cols="2" class="info-grid">
              <UCard class="info-item battery-level">
                <UProgress
                  type="circle"
                  :value="selectedSensor.batteryLevel"
                  :color="getBatteryColor(selectedSensor.batteryLevel)"
                >
                  <template #default="{ value }">
                    <span class="percentage-value">{{ value }}%</span>
                  </template>
                </UProgress>
                <p>Battery Level</p>
              </UCard>
              <UCard
                v-for="(item, key) in sensorInfo"
                :key="key"
                class="info-item"
              >
                <h3>{{ item.value }}</h3>
                <p>{{ item.label }}</p>
              </UCard>
            </UGrid>
            <p class="last-updated">
              Last Updated: {{ formatDate(selectedSensor.timestamp) }}
            </p>
            <p class="last-maintenance">
              Last Maintenance: {{ formatDate(selectedSensor.lastMaintenance) }}
            </p>
          </div>
          <div class="sensor-location">
            <h2>Location</h2>
            <div id="mini-map" ref="miniMap"></div>
          </div>
        </UGrid>
        <div class="chart-container">
          <h2>Sensor Data</h2>
          <div ref="scrollContainer" class="scroll-container">
            <div v-if="dataLoaded" class="charts-wrapper">
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
            <div v-else class="loading">
              <UIcon name="i-heroicons-arrow-path" class="loading-spinner" />
              <p>Loading data...</p>
            </div>
          </div>
          <div class="dashboard-footer">
            <UButton color="primary" @click="resetAllCharts">
              Reset All
            </UButton>
            <div v-if="globalDateRange.length === 2" class="date-range-display">
              {{ formatDateRange(globalDateRange) }}
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </UModal>
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

const getBatteryColor = (percentage) => {
  if (percentage < 20) return 'red'
  if (percentage < 50) return 'yellow'
  return 'green'
}

const sensorInfo = computed(() => ({
  signalStrength: {
    value: `${selectedSensor.value.signalStrength}/5`,
    label: 'Signal Strength',
  },
  airQuality: { value: selectedSensor.value.airQuality, label: 'Air Quality' },
  soilMoisture: {
    value: selectedSensor.value.soilMoisture,
    label: 'Soil Moisture',
  },
}))

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
.sensor-detail {
  width: 90%;
  max-width: 1200px;
  height: 90%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.sensor-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e6e6e6;
}

.sensor-header h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
  flex-grow: 1;
}

.sensor-content {
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
}

.sensor-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.stat-item,
.info-item {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 15px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stat-item h3,
.info-item h3 {
  margin: 0;
  font-size: 24px;
  color: #409eff;
}

.stat-item p,
.info-item p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #606266;
}

.sensor-details {
  display: flex;
  gap: 20px;
}

.sensor-info,
.sensor-location {
  flex: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.battery-level {
  grid-column: span 2;
}

.sensor-info h2,
.sensor-location h2 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #303133;
}

.last-updated,
.last-maintenance {
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
}

#mini-map {
  width: 100%;
  height: 300px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.mapboxgl-ctrl-top-right) {
  top: 10px;
  right: 10px;
}

:deep(.mapboxgl-ctrl-scale) {
  margin-bottom: 10px;
  margin-right: 10px;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scroll-container {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
}

.charts-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.dashboard-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #e0e0e0;
}

.navigation-buttons {
  display: flex;
  gap: 5px;
  margin-right: 10px;
}

.date-range-display {
  font-size: 0.8rem;
  color: #666;
}

.percentage-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

@media (max-width: 1024px) {
  .sensor-detail {
    width: 95vw;
    height: 95vh;
  }
  .sensor-stats,
  .info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .battery-level {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .sensor-detail {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
  .sensor-stats,
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .sensor-details {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .sensor-stats,
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
