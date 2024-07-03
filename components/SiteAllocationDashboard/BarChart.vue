<template>
  <div class="w-full h-80">
    <Bar :data="groupedChartVals" :options="options" />
  </div>
</template>

<script setup>
import { useDashboardUIStore } from '@/stores/dashboardUI'

import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import * as d3 from 'd3'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const store = useDashboardUIStore()
const { feasibleSites, builtSites } = storeToRefs(store)

const props = defineProps({
  type: { type: String, default: 'TOTAL_POP' },
  chartTitle: { type: String, default: '' },
})

// """
// Bar plot of a given variable over the built sites (colored by borough).
// Example: outreached population.
// """
const groupedChartVals = computed(() => {
  const groupedSites = Object.groupBy(
    builtSites.value,
    ({ BOROUGH }) => BOROUGH
  )

  // Generate a color scale using D3's scaleOrdinal and a color scheme
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

  const labels = []
  const datasets = []
  const colors = []
  Object.values(groupedSites).forEach((borough) => {
    borough.forEach((site) => {
      labels.push(site.DEVELOPMENT)
      datasets.push(parseFloat(site[props.type]))
      colors.push(colorScale(site.BOROUGH))
    })
  })

  return {
    labels,
    datasets: [
      {
        label: props.chartTitle,
        data: datasets,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  // elements: { point: { radius: 2, borderWidth: 0 } },
  plugins: {
    title: {
      display: true,
      text: props.chartTitle,
    },
  },
}
</script>

<style scoped>
.tooltip {
  position: absolute;
  text-align: left;
  max-width: 150px;
  height: auto;
  padding: 5px;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
}
</style>
