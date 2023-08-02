<template>
  <div id="pop-up" class="absolute w-3/12 h-2/4 p-8 bg-[#004E32]">
    <div class="cursor-pointer" @click="$emit('closePopUp', {})">X</div>
    <h1>{{ devProps.DEVELOPMEN }}</h1>
    <DoughnutChart :chart-data="testData" :width="150" :height="150" />
    <table class="table-fixed table">
      <tbody class="text-white">
        <tr>
          <td>Number 18-24 years old</td>
          <td id="text-right">
            {{
              parseFloat(
                ((devProps.pop20t24P + devProps.pop20t24P / 2) / 100) *
                  parseFloat(devProps['TOTAL POPULATION'].replace(/,/g, ''))
              ).toFixed(2)
            }}
          </td>
        </tr>
        <tr>
          <td>City district</td>
          <td id="text-right">
            {{ devProps['NY CITY COUNCIL DISTRICT'] }}
          </td>
        </tr>
        <tr>
          <td>Congressional District</td>
          <td id="text-right">
            {{ 'NY-' + devProps['US CONGRESSIONAL DISTRICT'] }}
          </td>
        </tr>
        <tr>
          <td>Available Area</td>
          <td id="text-right">
            {{ devProps['suit_area'].toFixed(2) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps({
  devProps: Object,
})

const testData = {
  datasets: [
    {
      data: [30, 40, 60, 70, 5],
      backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
      borderColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
    },
  ],
}
</script>

<style>
#pop-up {
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
