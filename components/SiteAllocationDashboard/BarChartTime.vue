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
const { parsedSolutions } = storeToRefs(store)

const props = defineProps({
  type: { type: String, default: 'TOTAL_POP' },
  chartTitle: { type: String, default: '' },
})

const checkNaN = (value) => {
  const valType = parseFloat(value)
  // Check for NaN and use 0 as a fallback
  return isNaN(valType) ? 0 : valType
}

//     """
// Bar plot of an aggregate and normalized variable over all sites.
// Example: expected travel time to the assigned sites, for each borough.
// """
const groupedChartVals = computed(() => {
  const groupedSites = Object.groupBy(
    parsedSolutions.value,
    ({ BOROUGH }) => BOROUGH
  )

  const time = props.type === 'TOTAL_POP' ? 'ETT_OUTREACH' : 'ETT_RECRUITMENT'

  // Generate a color scale using D3's scaleOrdinal and a color scheme
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

  const labels = []
  const datasets = []
  const colors = []
  Object.values(groupedSites).forEach((borough) => {
    const boroughName = borough[0].BOROUGH
    labels.push(boroughName)
    colors.push(colorScale(boroughName))
    const weightedAverage = checkNaN(
      borough
        .map((value) => {
          return checkNaN(value[props.type]) * checkNaN(value[time])
        })
        .reduce((acc, curr) => acc + curr, 0) /
        borough
          .map((value) => checkNaN(value[props.type]))
          .reduce((acc, curr) => acc + curr, 0)
    )
    datasets.push(weightedAverage)
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
