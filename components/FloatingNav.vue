<script setup>
// IMPORTS
import {
    ElMenu,
    ElSubMenu,
    ElMenuItem,
    ElCheckbox,
    ElDatePicker,
    ElSlider,
} from 'element-plus'
import 'element-plus/dist/index.css'
import { useDashboardUIStore } from '@/stores/dashboardUI';

// import ParallelCoords from '~~/components/ParallelCoords'

// Store
const store = useDashboardUIStore()
const {
    existingHubs,
    existingDatasets,
    dataDashboard,
    dataDashboardValues,
    selectedSiteProps,
    development,
    toggleHub,
    toggleDataset,
} = storeToRefs(store)

existingHubs.value = Object.keys(existingHubs.value).reduce((acc, key) => {
    acc[key] = false
    return acc
}, {})

existingDatasets.value = Object.keys(existingDatasets.value).reduce((acc, key) => {
    acc[key] = false
    return acc
}, {})

function applyDateFilter(period) {
}

const formatTimeTooltip = (val) => {
    const hours = Math.floor(val);
    const minutes = Math.floor((val % 1) * 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

const sampleMetrics = {
    Temperature: { name: 'Temperature', units: '°F' },
    Particles: { name: 'Particulate Matter', units: 'μg/m3' },
    Humidity: { name: 'Relative Humidity', units: '%RH' },
    Moisture: { name: 'Soil Moisture', units: '% Moisture' },
    Solar: { name: 'Solar Input', units: 'Amps' },
}
</script>

<template>
    <el-menu default-active="2" class="el-menu-vertical-demo" unique-opened>
        <el-sub-menu index="locations">
            <template #title> LOCATION SELECTION </template>
            <el-menu-item v-for="(isActive, name) in existingHubs" :key="name">
                <el-checkbox :label="name" v-model="existingHubs[name]" @change="toggleHub(name)" />
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="data">
            <template #title> DATA SELECTIONS </template>
            <el-menu-item v-for="(isActive, dataset) in existingDatasets" :key="dataset">
                <el-checkbox :label="dataset" v-model="existingDatasets[dataset]" @change="toggleDataset(dataset)" />
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="filter">
            <template #title> DATE & TIME </template>
            <el-menu-item>
                <el-date-picker v-model="dataDashboard.dateRange" type="daterange" range-separator="to"
                    start-placeholder="Start Date" end-placeholder="End Date" align="right" unlink-panels />
            </el-menu-item>
            <el-menu-item>
                <div style="margin-right: 20px;">Time</div>
                <el-slider v-model="dataDashboardValues.time" range :min="0" :max="24" :step="0.5" show-stops
                    :format-tooltip="formatTimeTooltip">
                </el-slider>
            </el-menu-item>
            <el-menu-item class="preset-date-filters">
                <button class="date-filter-button" @click="applyDateFilter('today')">Today</button>
                <button class="date-filter-button" @click="applyDateFilter('24hours')">Last 24 Hours</button>
                <button class="date-filter-button" @click="applyDateFilter('week')">This Week</button>
                <button class="date-filter-button" @click="applyDateFilter('Last7days')">Last 7 Days</button>
                <button class="date-filter-button" @click="applyDateFilter('month')">This Month</button>
                <button class="date-filter-button" @click="applyDateFilter('Last30days')">Last 30 Days</button>
                <button class="date-filter-button" @click="applyDateFilter('Year')">This Year</button>
                <button class="date-filter-button" @click="applyDateFilter('Last365days')">Last 365 Days</button>
            </el-menu-item>

        </el-sub-menu>
    </el-menu>
</template>


<style scoped>
.el-menu-vertical-demo {
    width: 300px;
    border-radius: 15px;
    position: absolute;
    z-index: 1000;
    left: 0px;
    top: 0px;
    background-color: #609F80;
    font-weight: bold;
    height: 100%;

}


.el-menu-vertical-demo :deep(.el-sub-menu:hover .el-sub-menu__title) {
    color: white;
    background-color: transparent;
}

.el-menu-item:hover {
    background-color: #4f8a6c;
}

.el-menu-item {
    font-size: 0.8rem;
    background-color: #609F80;
    color: black;
    margin: 0;
}

:deep(.el-checkbox) {
    color: black;
}

:deep(.el-checkbox:hover) {
    color: white;
    font-weight: bold;
}

:deep(.el-checkbox__inner) {
    border: 1px solid black !important;
    background-color: #609F80 !important;
}

:deep(.el-checkbox input:checked ~ .el-checkbox__inner) {
    background-color: white !important;
    border-color: white !important;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: white !important;
    font-weight: bold !important;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner::after) {
    color: #609F80 !important;
    border-color: #609F80 !important;

}

.el-menu-vertical-demo :deep(.el-date-editor) {
    background-color: #609F80;
}

.el-menu-vertical-demo :deep(.el-date-editor .el-input__inner),
.el-menu-vertical-demo :deep(.el-date-editor .el-input__icon) {
    color: white;

}

.time-slider-container {
    padding-top: 10px;
}

.preset-date-filters {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    padding: 10px;
    min-height: 200px;
    justify-content: center;
    align-items: center;
}

.date-filter-button {
    background-color: #609F80;
    color: white;
    border: 1px solid white;
    border-radius: 5px;
    padding: 5px 10px;
    font-weight: bold;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s, color 0.3s;
    font-size: 0.8rem;
    line-height: 1;
    height: auto;
    box-sizing: border-box;
}

.date-filter-button:hover,
.date-filter-button:focus {
    background-color: white;
    color: #609F80;
    outline: none;
}
</style>
