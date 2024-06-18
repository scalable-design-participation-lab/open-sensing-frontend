<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
// IMPORTS
import { csv } from 'd3'

// import ParallelCoords from '~~/components/ParallelCoords'

// Store

definePageMeta({
  middleware: [
    async function (to, from) {
      // Custom inline middleware
      const store = useDashboardUIStore()
      const { loadSensorData } = store

      const response = await fetch(
        'https://gist.githubusercontent.com/cesandoval/9e02adbb9527c367a7ae893f735e3ff3/raw/a547d333c742977926d5e877ea076528cf9b142a/sensorData.csv'
      )

      const text = await response.text()
      const data = d3.csvParse(text, (d) => {
        return {
          date: new Date(d.timestamp), //d3.timeParse('%Y-%m-%d %H:%M:%S')(d.timestamp),
          temperature: +d.temperature,
          relative_humidity: +d.relative_humidity,
          voc: +d.voc,
          nox: +d.nox,
          pm1: +d.pm1,
          pm25: +d.pm25,
          pm4: +d.pm4,
          pm10: +d.pm10,
        }
      })

      data.sort((a, b) => a.date - b.date)

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

      const metricData = {}
      Object.keys(metrics.value).forEach((key) => {
        metricData[key] = data.map((d) => ({
          date: d.date,
          value: d[metrics.value[key].name],
        }))
      })

      loadSensorData(metricData)
    },
  ],
})
import * as d3 from 'd3'
const store = useDashboardUIStore()
const { masterSolutions, maxMinVals, updatedMaxMinVals, dataDashboard } =
  storeToRefs(store)
const { loadMasterSolutions } = store

// loadMasterSolutions()

// const { data, pending, error } = await useFetch(() => 'sensorData.csv')
// console.log(data, pending, error)
// await useAsyncData('masterSolutions', () => store.loadMasterSolutions())
// await loadMasterSolutions()

const getRuntimeConfig = async () => {
  // const response = await fetch('/master_solutions.csv')
  // const text = await response.text()
  // const data = d3.csvParse(text, (d) => {
  //   console.log(d)
  // })
  // const { data, pending, error } = await useFetch(() => '/master_solutions.csv')
  // console.log(data, pending, error)
  // console.log(text, 124124234234)
  // return await runtimeConfig.json()
  await loadMasterSolutions()
}
getRuntimeConfig()
// const response = await fetch('/sensorData.csv')
// console.log(response)
</script>

<template>
  <section>
    <MITHeader />

    <!-- <DataPopUp
      v-if="Object.keys(selectedSiteProps).length > 0"
      @close-pop-up="selectedSiteProps = {}"
    /> -->
    <FloatingNavSite v-if="masterSolutions.length > 0" class="top-24 left-5" />
    <SiteMap v-show="!dataDashboard" />
    <!-- <SensorDashboard v-show="dataDashboard" /> -->

    <MITFooter />
  </section>
</template>

<style>
body {
  font-family: 'lato', sans-serif;
}
</style>
