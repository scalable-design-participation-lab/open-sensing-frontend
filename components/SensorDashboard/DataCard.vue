<script setup>
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

// set up props for the component
const props = defineProps({
  // make chartData an object and give it a default value
  chartData: { type: Object, default: () => { } },
})


</script>

<template>
  <div class="px-4">
    <div class="relative pb-4">
      <select class="absolute right-0 bg-[#FFFFFF]/[.6]">
        <option value="all">All Data</option>
        <option value="dailyMean">Daily Averages</option>
      </select>
    </div>
    <LineChart :chart-data="chartData" />
  </div>
</template>

<style>
#overview-card {
  bottom: 1.25rem;
  right: 1.25rem;
  border-radius: 1.5rem;
}

.table {
  font-size: 1.125rem;
  /* 18px */
  line-height: 1.75rem;
  /* 28px */
}

#text-right {
  text-align: right;
}
</style>
