<template>
  <transition name="fade">
    <div
      v-if="showSensorDetail && selectedSensor"
      class="sensor-detail-overlay"
    >
      <div class="sensor-detail">
        <header class="sensor-header">
          <h1>{{ selectedSensor.location }}</h1>
          <el-tag :type="getStatusType(selectedSensor.status)">
            {{ selectedSensor.status }}
          </el-tag>
          <el-button class="close-button" @click="closeSensorDetail">
            ×
          </el-button>
        </header>
        <div class="sensor-content">
          <div class="sensor-stats">
            <div class="stat-item">
              <h3>{{ selectedSensor.temperature.toFixed(1) }}°C</h3>
              <p>Temperature</p>
            </div>
            <div class="stat-item">
              <h3>{{ selectedSensor.humidity.toFixed(1) }}%</h3>
              <p>Humidity</p>
            </div>
            <div class="stat-item">
              <h3>{{ selectedSensor.voc }}</h3>
              <p>VOC (ppb)</p>
            </div>
            <div class="stat-item">
              <h3>{{ selectedSensor.nox }}</h3>
              <p>NOx (ppb)</p>
            </div>
            <div class="stat-item">
              <h3>{{ selectedSensor.pm25 }}</h3>
              <p>PM2.5 (µg/m³)</p>
            </div>
          </div>
          <div class="sensor-details">
            <div class="sensor-info">
              <h2>Sensor Information</h2>
              <div class="info-grid">
                <div class="info-item battery-level">
                  <el-progress
                    type="circle"
                    :percentage="selectedSensor.batteryLevel"
                    :color="getBatteryColor"
                  >
                    <template #default="{ percentage }">
                      <span class="percentage-value">{{ percentage }}%</span>
                    </template>
                  </el-progress>
                  <p>Battery Level</p>
                </div>
                <div class="info-item">
                  <h3>{{ selectedSensor.signalStrength }}/5</h3>
                  <p>Signal Strength</p>
                </div>
                <div class="info-item">
                  <h3>{{ selectedSensor.airQuality }}</h3>
                  <p>Air Quality</p>
                </div>
                <div class="info-item">
                  <h3>{{ selectedSensor.soilMoisture }}</h3>
                  <p>Soil Moisture</p>
                </div>
              </div>
              <p class="last-updated">
                Last Updated: {{ formatDate(selectedSensor.timestamp) }}
              </p>
              <p class="last-maintenance">
                Last Maintenance:
                {{ formatDate(selectedSensor.lastMaintenance) }}
              </p>
            </div>
            <div class="sensor-location">
              <h2>Location</h2>
              <div id="mini-map" ref="miniMap"></div>
            </div>
          </div>
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
                <div class="loading-spinner"></div>
                <p>Loading data...</p>
              </div>
            </div>
            <div class="dashboard-footer">
              <button class="reset-button" @click="resetAllCharts">
                Reset All
              </button>
              <div
                v-if="globalDateRange.length === 2"
                class="date-range-display"
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
const { selectedSensor, showSensorDetail, selectedDatasets, sensorData } =
  storeToRefs(store)

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

const getStatusType = (status) => {
  switch (status) {
    case 'Active':
      return 'success'
    case 'Inactive':
      return 'danger'
    case 'Maintenance':
      return 'warning'
    default:
      return 'info'
  }
}

const getBatteryColor = (percentage) => {
  if (percentage < 20) return '#F56C6C'
  if (percentage < 50) return '#E6A23C'
  return '#67C23A'
}

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
    zoom: 17,
    interactive: false,
    attributionControl: false,
  })

  new mapboxgl.Marker({
    color: '#FF0000',
  })
    .setLngLat(selectedSensor.value.coordinates)
    .addTo(miniMap.value)

  miniMap.value.on('style.load', () => {
    miniMap.value.setPitch(45)
    miniMap.value.setBearing(20)
  })
}

const closeSensorDetail = () => {
  store.toggleSensorDetail()
}

const updateGlobalDateRange = (range) => {
  globalDateRange.value = range
  store.updateDataDashboardValues('dateRange', range)
}

const resetAllCharts = () => {
  globalDateRange.value = []
  store.updateDataDashboardValues('dateRange', [])
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

watch(
  selectedSensor,
  (newSensor) => {
    if (newSensor && miniMap.value) {
      miniMap.value.setCenter(newSensor.coordinates)
      miniMap.value.getSource('marker').setData({
        type: 'Point',
        coordinates: newSensor.coordinates,
      })
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
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.sensor-detail {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sensor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e6e6e6;
}

.sensor-header h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.close-button {
  font-size: 24px;
  color: #909399;
  background: none;
  border: none;
  cursor: pointer;
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
  height: 250px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.reset-button {
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.reset-button:hover {
  background-color: #45a049;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .sensor-stats,
  .info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .battery-level {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
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
