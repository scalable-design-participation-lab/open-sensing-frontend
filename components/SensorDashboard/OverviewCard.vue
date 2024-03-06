<script setup>
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps({
  // give name a default value

  name: { type: String, default: '' },
  devProps: { type: Object, default: () => { } },
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
    <div class="flex flex-col">
      <div class="flex justify-between mb-3 border-b-[3px] border-b-[#004E32]">
        <div class="">
          <h1>{{ props.name }}</h1>
        </div>
        <div class="flex justify-between items-center gap-2">
          <div class="">{{ 'OPERATIONAL' }}</div>
          <div class="h-[12px] w-[12px] bg-lime-300 rounded-full border border-[#004E32]"></div>
        </div>
      </div>
      <div class="flex flex-row items-center gap-4 w-full">
        <div class="items-center basis-1/4">
          <DoughnutChart class="mb-2" :chart-data="testData" :width="100" :height="100" />
          <div class="text-center">GOOD</div>
        </div>

        <table class="table-fixed table basis-3/4">
          <tbody class="text-black">
            <tr class="border-b border-b-[#004E32]">
              <td>Air Quality</td>
              <td id="text-right">
                {{ 'Good' }}
              </td>
            </tr>
            <tr class="border-b border-b-[#004E32]">
              <td>Battery</td>
              <td id="text-right">
                {{ '80%' }}
              </td>
            </tr>
            <tr class="border-b border-b-[#004E32]">
              <td>Spoil Moisture</td>
              <td id="text-right">
                {{ '42%' }}
              </td>
            </tr>
            <tr class="border-b border-b-[#004E32]">
              <td>Temperature</td>
              <td id="text-right">
                {{ '67F' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
  font-size: 1.125rem;
  /* 18px */
  line-height: 1.75rem;
  /* 28px */
}

#text-right {
  text-align: right;
}
</style>
