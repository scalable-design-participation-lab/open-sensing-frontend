<template>
    <el-menu default-active="2" class="el-menu-vertical-demo">
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


<style>
.el-menu-vertical-demo {
    width: 300px;
    border-radius: 15px;
    position: absolute;
    z-index: 1000;
    left: 20px;
    top: 100px;
    box-shadow: 10px 10px 35px rgba(0, 0, 0, 0.35);
    background-color: #609F80;
}
.el-sub-menu__title {
    font-size: 1rem;
    border-radius: 15px;
    color: white;
   
}
.el-sub-menu__title:hover {
    color: #609F80;
    
}

.el-menu-item {
    font-size: 0.8rem;
    background-color: #609F80;
    color: white;
    margin: 0;
    padding: 0 0 0 20px;
    
}

.el-menu-item:hover {
    color: white;
    font-weight: bold;
    background-color: #609F80;
    
}

.el-checkbox {
    color: white;
    
}

.el-checkbox:hover {
    color: white;
    font-weight: bold;
    background-color: #609F80;

}
.el-checkbox input:checked ~ .el-checkbox__label {
    color: white;
    font-weight: bold  ;
    
}
.el-checkbox__inner {
    border: 1px solid white;
    background-color: #609F80;
}


.el-checkbox input:checked ~ .el-checkbox__inner {
    background-color: white;
    border-color: white;
    
}




</style>

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