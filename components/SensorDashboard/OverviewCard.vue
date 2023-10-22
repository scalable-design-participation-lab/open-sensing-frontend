<script setup>
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps({
  // give name a default value

  name: { type: String, default: '' },
  devProps: { type: Object, default: () => {} },
})

const testData = {
  datasets: [
    {
      data: [77, 23],
      backgroundColor: ['#004E32', '#abaeb3'],
      borderColor: ['#004E32', '#abaeb3'],
    },
  ],
}
</script>

<template>
  <div id="overview-card" class="w-96 h-52 p-4 bg-white">
    <div class="border-black flex flex-row">
      <div class="basis-2/3">
        <h1>{{ props.name }}</h1>
      </div>
      <div class="basis-1/3">
        <div class="flex flex-row">
          <div class="basis-3/4">{{ 'OPERATIONAL' }}</div>
          <div
            class="basis-1/4 h-[12px] w-[12px] bg-lime-300 rounded-full border border-[#004E32]"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-row">
      <div>
        <DoughnutChart
          class="basis-1/4"
          :chart-data="testData"
          :width="100"
          :height="100"
        />
        <div>GOOD</div>
      </div>

      <table class="table-fixed table basis-3/4">
        <tbody class="text-black">
          <tr>
            <td>Air Quality</td>
            <td id="text-right">
              {{ 'Good' }}
            </td>
          </tr>
          <tr>
            <td>Battery</td>
            <td id="text-right">
              {{ '80%' }}
            </td>
          </tr>
          <tr>
            <td>Spoil Moisture</td>
            <td id="text-right">
              {{ '42%' }}
            </td>
          </tr>
          <tr>
            <td>Temperature</td>
            <td id="text-right">
              {{ '67F' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
#overview-card {
  bottom: 1.25rem;
  right: 1.25rem;
  border-radius: 1.5rem;
}

.table {
  font-size: 1.125rem; /* 18px */
  line-height: 1.75rem; /* 28px */
}

#text-right {
  text-align: right;
}
</style>
