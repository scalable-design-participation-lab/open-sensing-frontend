<script setup>
// IMPORTS

// import ParallelCoords from '~~/components/ParallelCoords'

// Store
const store = useDashboardUIStore()
const {
  existingHubs,
  existingDatasets,
  dataDashboard,
  selectedSiteProps,
  development,
} = storeToRefs(store)

const sampleMetrics = {
  Temperature: { name: 'Temperature', units: '°F' },
  Particles: { name: 'Particulate Matter', units: 'μg/m3' },
  Humidity: { name: 'Relative Humidity', units: '%RH' },
  Moisture: { name: 'Soil Moisture', units: '% Moisture' },
  Solar: { name: 'Solar Input', units: 'Amps' },
}
</script>

<template>
  <section>
    <NUHeader />

    <DataPopUp
      v-if="Object.keys(selectedSiteProps).length > 0"
      @close-pop-up="selectedSiteProps = {}"
    />
    <MapDashboard v-show="!dataDashboard" />
    <SensorDashboard v-show="dataDashboard" />

    <NUFooter />
  </section>
</template>

<style>
body {
  font-family: 'lato', sans-serif;
}
</style>
