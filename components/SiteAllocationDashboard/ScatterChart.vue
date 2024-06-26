<template>
  <div class="w-full h-80">
    <Scatter :data="sortedChartVals" :options="options" />
  </div>
</template>

<script setup>
import { useDashboardUIStore } from '@/stores/dashboardUI'

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Scatter } from 'vue-chartjs'

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const store = useDashboardUIStore()
const { feasibleSites } = storeToRefs(store)

const props = defineProps({
  type: { type: String, default: 'TOTAL_POP' },
  chartTitle: { type: String, default: '' },
})

const sortedChartVals = computed(() => {
  const allData = { datasets: [] }
  const sortedVals = feasibleSites.value.sort(
    (a, b) => parseFloat(a[props.type]) - parseFloat(b[props.type])
  )
  const chartVals = []
  const selectedSites = []
  sortedVals.forEach((site, index) => {
    if (site.BUILT === '0')
      chartVals.push({
        x: index,
        y: parseFloat(site[props.type]),
      })
    else
      selectedSites.push({
        x: index,
        y: parseFloat(site[props.type]),
      })
  })

  allData.datasets = [
    {
      label: 'Feasible Sites',
      fill: false,
      borderColor: '#7acbf9',
      backgroundColor: '#7acbf9',
      data: chartVals,
    },
    {
      label: 'Selected Sites',
      fill: false,
      borderColor: '#f87979',
      backgroundColor: '#f87979',
      data: selectedSites,
    },
  ]

  return allData
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  elements: { point: { radius: 2, borderWidth: 0 } },
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
