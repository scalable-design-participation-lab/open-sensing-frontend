<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div ref="chartContainer" class="chart-container">
    <button class="close-btn" @click="closeModal">&times;</button>
    <div class="columns-2 w-full">
      <ScatterChart />
      <ScatterChart :type="'POP18_24'" />
      <ScatterChart :type="'AREA_FLOOD'" />
      <ScatterChart :type="'AREA_BUILD'" />
      <BarChart />
    </div>

    <!-- <FloatingNavSite /> -->
    <!-- <div ref="scrollContainer" class="scroll-container">
      <div v-if="mounted">
        <LineChart
          v-for="(metric, metricName) in metrics"
          :key="metricName"
          :class="{ innactive: !selectedDatasets.includes(metricName) }"
          :metric="metric"
          :data="sensorData[metricName]"
          :margin="margin"
          :width="width"
          :height="height"
        />
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const store = useDashboardUIStore()
const { selectedDatasets, sensorData } = storeToRefs(store)
const mounted = ref(false)

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

const margin = ref({ top: 30, right: 30, bottom: 50, left: 60 })
const height = ref(0)
const width = ref(0)
const containerWidth = ref(0)
const scrollContainer = ref(null)

const chartHeight = 300 // Fixed height for each chart

onMounted(() => {
  // containerWidth.value = scrollContainer.value.clientWidth
  // width.value = containerWidth.value - margin.value.left - margin.value.right
  // height.value = chartHeight - margin.value.top - margin.value.bottom
  // mounted.value = true
})

// const props = defineProps(['visible'])
const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.innactive {
  display: none;
}
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
