<template>
    <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#609F80" text-color="white"
        style="position: absolute; z-index: 1000; border-radius:15px; left: 20px; top: 100px; width: 300px; box-shadow: 10px 10px 35px rgba(0,0,0,0.35 );">
        <el-sub-menu index="locations">
            <template #title> LOCATION SELECTION </template>
            <el-menu-item v-for="name in Object.keys(existingHubs)" :key="name">
                <el-checkbox v-model="existingHubs[name]" :label="name" @change="(val) => (development = name)" />
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="data">
            <template #title> DATA SELECTIONS </template>
            <el-menu-item v-for="dataset in Object.keys(existingDatasets)" :key="dataset">
                <el-checkbox v-model="existingDatasets[dataset]" :label="dataset" />
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="filter">
            <template #title> DATE & TIME </template>
            <el-menu-item v-for="dataset in Object.keys(existingDatasets)" :key="dataset">
                <el-checkbox v-model="existingDatasets[dataset]" :label="dataset" />
            </el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

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