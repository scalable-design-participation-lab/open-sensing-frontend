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
            <el-menu-item>
                <el-date-picker v-model="dataDashboard.dateRange" type="daterange" range-separator="to"
                    start-placeholder="Start Date" end-placeholder="End Date" align="right" unlink-panels />
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
    left: 20px;
    top: 100px;
    box-shadow: 10px 10px 35px rgba(0, 0, 0, 0.35);
    background-color: #609F80;
    font-weight: bold;

}

.el-menu-vertical-demo :deep(.el-sub-menu:last-child .el-menu-item:last-child) {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
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
    color: white;
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


.el-menu-vertical-demo :deep(.el-date-editor) {
    background-color: #609F80;
}

.el-menu-vertical-demo :deep(.el-date-editor .el-input__inner),
.el-menu-vertical-demo :deep(.el-date-editor .el-input__icon) {
    color: white;

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

<script setup>
// IMPORTS
import {
    ElMenu,
    ElSubMenu,
    ElMenuItem,
    ElCheckbox,
    ElDatePicker,
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

existingHubs.value = Object.keys(existingHubs.value).reduce((acc, key) => {
    acc[key] = false
    return acc
}, {})

existingDatasets.value = Object.keys(existingDatasets.value).reduce((acc, key) => {
    acc[key] = false
    return acc
}, {})

function applyDateFilter(period) {
    // logic to set `dataDashboard.dateRange` based on the selected period
    // 'today', 'week', 'month' could be handled here
}

const sampleMetrics = {
    Temperature: { name: 'Temperature', units: '°F' },
    Particles: { name: 'Particulate Matter', units: 'μg/m3' },
    Humidity: { name: 'Relative Humidity', units: '%RH' },
    Moisture: { name: 'Soil Moisture', units: '% Moisture' },
    Solar: { name: 'Solar Input', units: 'Amps' },
}
</script>