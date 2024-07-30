<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div ref="chartContainer" class="chart-container">
    <button class="close-btn" @click="closeModal">&times;</button>
    <FloatingNav />
    <div ref="scrollContainer" class="scroll-container">
      <div v-if="dataLoaded">
        <LineChart
          v-for="(metric, metricName) in metrics"
          v-show="selectedDatasets.includes(metricName)"
          :key="metricName"
          :metric="metric"
          :data="sensorData[metricName]"
          :margin="margin"
          :width="chartWidth"
          :height="chartHeight"
        />
      </div>
      <div v-else>Loading data...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import LineChart from './LineChart.vue'
import FloatingNav from '../FloatingNav.vue'

const store = useDashboardUIStore()
const { selectedDatasets, sensorData } = storeToRefs(store)

const chartContainer = ref(null)
const scrollContainer = ref(null)
const chartWidth = ref(0)
const chartHeight = 300 // Fixed height for each chart

const margin = { top: 30, right: 30, bottom: 50, left: 60 }

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

onMounted(() => {
  console.log('Dashboard mounted, sensorData:', sensorData.value)
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 53%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 95%;
  height: 85%;
  background-color: white;
  border-radius: 15px;
  box-shadow: 10px 10px 35px rgba(0, 0, 0, 0.35);
  z-index: 10;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: lightgray;
  cursor: pointer;
}

.close-btn:hover {
  color: #609f80;
}

.scroll-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  width: calc(100% - 320px);
  height: 95%;
  padding: 5px;
  margin-left: 300px;
  margin-top: 50px;
  margin-bottom: 30px;
}

.scroll-container::-webkit-scrollbar {
  width: 10px;
  background-color: transparent;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: #609f80;
  border-radius: 10px;
  border: 1px solid transparent;
  background-clip: padding-box;
}

.scroll-container::-webkit-scrollbar-button {
  display: none;
}
</style>
