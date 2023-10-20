<script setup>
import { ref } from 'vue'
import { csv } from 'd3'

const chartData = ref({})

onMounted(async () => {
  const allData = await csv('/sensorData.csv')
  const labels = allData.map((d) => d['timestamp'])
  // loop through all the elements in metrics
  metrics.forEach((metric) => {
    chartData.value[metric] = {
      labels,
      datasets: [
        {
          layout: { padding: 50 },
          data:
            metric != 'heat_index'
              ? allData.map((d) => parseFloat(d[metric]))
              : allData.map(
                  (d) =>
                    0.5 *
                    (parseFloat(d['temperature']) +
                      61 +
                      (parseFloat(d['temperature']) - 68) * 1.2 +
                      parseFloat(d['relative_humidity']) * 0.094)
                ),
          fill: false,
          pointStyle: false,
          borderColor: 'rgb(255, 255, 255)',
          tension: 0.1,
          // options: { plugins: { legend: { position: 'right' } } },
        },
      ],
    }
  })
})

const devNames = ref([
  'HOWARD',
  'BAY VIEW',
  'ASTORIA',
  'WAGNER',
  'FOREST',
  "MARINER'S HARBOR",
])

const metrics = [
  'temperature',
  'heat_index',
  'relative_humidity',
  'pm25',
  'pm10',
]

const getClass = (metric) => {
  {
    const tailwindClass = 'mt-8 bg-[#41715C] overflow-x-scroll'
    if (metric != 'temperature') return tailwindClass + ' w-1/2'
    else return tailwindClass
  }
}
</script>

<template>
  <div
    class="w-full px-4 bg-[#004E32] overflow-x-scroll"
    :style="{ height: 'calc(100vh - 50px)' }"
  >
    <div class="bg-[#41715C] overflow-x-scroll">
      <h1 class="p-4">Overview</h1>
      <table>
        <tr>
          <td v-for="name in devNames" :key="name" class="pl-4 pb-4">
            <OverviewCard />
          </td>
        </tr>
      </table>
    </div>

    <div
      v-for="(metricData, metric) in chartData"
      :key="metric"
      :class="getClass(metric)"
    >
      <h1 class="p-4">{{ metric }}</h1>
      <DataCard :chart-data="metricData" />
    </div>
  </div>
</template>

<style>
#pop-up {
  bottom: 1.25rem;
  right: 1.25rem;
  border-radius: 1.5rem;
}
</style>
