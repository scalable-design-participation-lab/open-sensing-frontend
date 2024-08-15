<!-- eslint-disable vue/multi-word-component-names
<template>
  <div ref="chartContainer" class="chart-container">
    <div class="dashboard-header">
      <h2 class="dashboard-title">Sensor Data</h2>
      <button class="close-btn" @click="closeModal">&times;</button>
    </div>
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
      <button class="reset-button" @click="resetAllCharts">Reset All</button>
      <div v-if="globalDateRange.length === 2" class="date-range-display">
        {{ formatDateRange(globalDateRange) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import LineChart from './LineChart.vue'

const store = useDashboardUIStore()
const { selectedDatasets, sensorData, dataDashboardValues } = storeToRefs(store)

const chartContainer = ref(null)
const scrollContainer = ref(null)
const chartWidth = ref(0)
const chartHeight = 180 // Slightly reduced height for compact layout
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

useResizeObserver(scrollContainer, (entries) => {
  const entry = entries[0]
  if (entry) {
    chartWidth.value = entry.contentRect.width - margin.left - margin.right
  }
})

onMounted(async () => {
  console.log('Dashboard mounted, loading sensor data if not already loaded')
  await store.loadSensorData()
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const updateGlobalDateRange = (range) => {
  globalDateRange.value = range
  store.updateDataDashboardValues('dateRange', range)
}

const resetAllCharts = () => {
  globalDateRange.value = []
  store.updateDataDashboardValues('dateRange', [])
  // You may need to emit an event to reset all LineChart components
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
</script>

<style scoped>
.chart-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 40%;
  background-color: white;
  border-radius: 15px 15px 0 0;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.2);
  z-index: 10;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.dashboard-title {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}

.scroll-container {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
}

.charts-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  padding: 5px 15px;
  background-color: #f8f9fa;
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

.scroll-container::-webkit-scrollbar {
  width: 8px;
  background-color: transparent;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: #609f80;
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 4px;
}
</style> -->
<!-- This code was generated by Builder.io -->
<!-- Dashboard.vue -->
<!-- Dashboard.vue -->
<!-- Dashboard.vue -->
<!-- Dashboard.vue -->
<!-- Dashboard.vue -->
<!-- Dashboard.vue -->
<!-- Dashboard.vue -->
<template>
  <div class="dashboard-grid">
    <el-card class="overview-card">
      <template #header>
        <div class="card-header">
          <h2>Sensor Overview</h2>
          <el-tag size="small" type="info">
            Last updated: {{ lastUpdated }}
          </el-tag>
        </div>
      </template>
      <p class="overview-description">{{ overviewDescription }}</p>
      <div class="overview-actions">
        <el-button type="primary" icon="el-icon-download" size="small">
          Export
        </el-button>
        <el-button type="info" icon="el-icon-share" size="small">
          Share
        </el-button>
        <el-button type="warning" icon="el-icon-edit" size="small">
          Edit
        </el-button>
      </div>
      <el-row :gutter="20" class="overview-stats">
        <el-col v-for="(stat, index) in overviewStats" :key="index" :span="8">
          <el-card class="stat-card" shadow="hover">
            <h3>{{ stat.value }}</h3>
            <p>{{ stat.label }}</p>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <div class="sensors-container">
      <el-row :gutter="20">
        <el-col
          v-for="sensor in sensors"
          :key="sensor.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="6"
          class="sensor-column"
        >
          <SensorTile :sensor="sensor" class="sensor-card" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import SensorTile from './SensorTile.vue'

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
    value: Object.keys(sensors.value[0]).filter((key) =>
      ['temperature', 'humidity', 'voc', 'nox', 'pm25'].includes(key)
    ).length,
    label: 'Values Measured',
  },
  {
    value: sensors.value.filter((sensor) => sensor.status === 'Maintenance')
      .length,
    label: 'Pending Issues',
  },
])
</script>

<style scoped>
.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  width: 85%;
  max-width: 1800px;
  height: 85%;
  margin: 20px auto;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-radius: 8px;
}

.overview-card {
  flex-shrink: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h2 {
  font-size: 1.2em;
  margin: 0;
}

.overview-description {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 15px;
}

.overview-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.overview-stats {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  padding: 10px;
}

.stat-card h3 {
  font-size: 1.4em;
  margin: 0;
  color: #409eff;
}

.stat-card p {
  margin: 5px 0 0;
  font-size: 0.8em;
  color: #666;
}

.sensors-container {
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.sensor-column {
  margin-bottom: 20px;
}

:deep(.el-card) {
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.sensors-container::-webkit-scrollbar {
  width: 6px;
}

.sensors-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sensors-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.sensors-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media (max-width: 1200px) {
  .dashboard-grid {
    width: 95vw;
    height: 95vh;
    margin: 10px auto;
  }
  .card-header h2 {
    font-size: 1em;
  }

  .overview-description {
    font-size: 0.8em;
  }

  .stat-card h3 {
    font-size: 1.2em;
  }

  .stat-card p {
    font-size: 0.7em;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    width: 100vw;
    height: 100vh;
    padding: 10px;
    margin: 0;
    border-radius: 0;
  }

  .overview-card {
    margin-bottom: 10px;
  }

  .card-header h2 {
    font-size: 0.9em;
  }

  .overview-description {
    font-size: 0.75em;
  }

  .stat-card h3 {
    font-size: 1em;
  }

  .stat-card p {
    font-size: 0.65em;
  }

  .sensor-column {
    margin-bottom: 5px;
  }
}
</style>
