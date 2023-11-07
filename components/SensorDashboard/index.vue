<script setup>
import { ref } from 'vue'
import { csv } from 'd3'

const chartData = ref({})

// Store
const store = useDashboardUIStore()
const { selectedDatasets, hubsList, existingHubs } = storeToRefs(store)

onMounted(async () => {
  const allData = await csv('/sensorData.csv')
  const labels = allData.map((d) => d['timestamp'])
  // loop through all the elements in metrics
  selectedDatasets.value.forEach((metric) => {
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

const getClass = (metric) => {
  {
    const tailwindClass = 'mt-8 bg-[#41715C] overflow-x-scroll'
    // if (metric != 'temperature') return tailwindClass + ' w-1/2'
    // else return tailwindClass
    return tailwindClass
  }
}
</script>

<template>
  <div
    class="px-4 bg-[#004E32] overflow-auto"
    :style="{ height: 'calc(100vh - 50px)' }"
  >
    <div class="bg-[#41715C] pb-4 px-4">
      <h1 class="p-4">Overview</h1>
      <div class="flex overflow-auto gap-4">
        <div v-for="name in hubsList" :key="name">
          <OverviewCard
            class="border-4 cursor-pointer"
            :class="
              existingHubs[name] ? 'border-[#DBFF00]' : 'border-[#41715C]'
            "
            :name="name"
            @click="existingHubs[name] = !existingHubs[name]"
          />
        </div>
      </div>
    </div>

    <div class="mt-8">
      <div
        v-for="metric in selectedDatasets"
        :key="metric"
        class="bg-[#41715C] overflow-y-auto w-full mb-8"
      >
        <h1 class="p-4">{{ metric }}</h1>
        <DataCard
          :chart-data="chartData[metric] !== undefined ? chartData[metric] : {}"
        />
      </div>
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
