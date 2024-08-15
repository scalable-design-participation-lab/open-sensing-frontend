<script setup>
// IMPORTS
import {
  ElMenu,
  ElSubMenu,
  ElMenuItem,
  ElCheckbox,
  ElContainer,
  ElAside,
  ElHeader,
  ElMain,
} from 'element-plus'
import 'element-plus/dist/index.css'

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
  <div class="common-layout">
    <el-container>
      <el-aside width="200px" class="bg-[#004E32]">
        <div class="text-left text-white">Green City Force</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="rgb(0, 78, 50)"
        >
          <el-sub-menu index="locations">
            <template #title> Locations </template>
            <el-menu-item v-for="name in Object.keys(existingHubs)" :key="name">
              <el-checkbox
                v-model="existingHubs[name]"
                :label="name"
                @change="(val) => (development = name)"
              />
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="data">
            <template #title> Data </template>
            <el-menu-item
              v-for="dataset in Object.keys(existingDatasets)"
              :key="dataset"
            >
              <el-checkbox
                v-model="existingDatasets[dataset]"
                :label="dataset"
              />
            </el-menu-item>
          </el-sub-menu>

          <el-checkbox v-model="dataDashboard" label="Data Dashboard" />
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="h-[50px] bg-[#004E32]">
          <h2 class="text-white text-left pl-[15px] pt-[15px]">
            Sensor Dashboard
          </h2>
        </el-header>
        <el-main :style="{ padding: 0 }">
          <DataPopUp
            v-if="Object.keys(selectedSiteProps).length > 0"
            @close-pop-up="selectedSiteProps = {}"
          />
          <MapDashboard v-show="dataDashboard" />
          <SensorDashboard v-show="!dataDashboard" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="postcss" scoped></style>
