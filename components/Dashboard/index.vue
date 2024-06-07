<template>
  <div ref="chartContainer" class="chart-container">
    <button class="close-btn" @click="closeModal">&times;</button>
    <FloatingNav />
    <div ref="scrollContainer" class="scroll-container">
      <LineChart
        v-for="metric in metrics"
        :key="metric.name"
        :metric="metric"
        :data="parsedData"
        :margin="margin"
        :width="width"
        :height="height"
      />
    </div>
  </div>
</template>

<script setup>
import * as d3 from 'd3'
import { ref, onMounted } from 'vue'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const store = useDashboardUIStore()
const { existingDatasets } = storeToRefs(store)

const parsedData = ref([])
const metrics = ref([
  { name: 'temperature', label: 'Temperature (°C)' },
  { name: 'relative_humidity', label: 'Relative Humidity (%)' },
  { name: 'voc', label: 'VOC (ppb)' },
  { name: 'nox', label: 'NOx (ppb)' },
  { name: 'pm1', label: 'PM1 (µg/m³)' },
  { name: 'pm25', label: 'PM2.5 (µg/m³)' },
  { name: 'pm4', label: 'PM4 (µg/m³)' },
  { name: 'pm10', label: 'PM10 (µg/m³)' },
])
const margin = ref({ top: 30, right: 30, bottom: 50, left: 60 })
const height = ref(0)
const width = ref(0)
const containerWidth = ref(0)
const scrollContainer = ref(null)

const chartHeight = 300 // Fixed height for each chart

const parseCSV = async () => {
  const response = await fetch('/sensorData.csv')
  const text = await response.text()
  const data = d3.csvParse(text, (d) => {
    return {
      date: new Date(d.timestamp), //d3.timeParse('%Y-%m-%d %H:%M:%S')(d.timestamp),
      temperature: +d.temperature,
      relative_humidity: +d.relative_humidity,
      voc: +d.voc,
      nox: +d.nox,
      pm1: +d.pm1,
      pm25: +d.pm25,
      pm4: +d.pm4,
      pm10: +d.pm10,
    }
  })

  data.sort((a, b) => a.date - b.date)
  parsedData.value = data

  scrollContainer.value.innerHTML = ''
  containerWidth.value = scrollContainer.value.clientWidth

  width.value = containerWidth.value - margin.value.left - margin.value.right
  height.value = chartHeight - margin.value.top - margin.value.bottom
}

onMounted(() => {
  parseCSV()
})

watchEffect(() => {
  parseCSV()
})

const props = defineProps(['visible'])
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

.tooltip {
  position: absolute;
  text-align: center;
  width: 60px;
  height: 28px;
  padding: 2px;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
}

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 1.5px;
}

.circle {
  fill: steelblue;
  stroke: none;
}

.brush .selection {
  fill: steelblue;
  fill-opacity: 0.3;
}
</style>
