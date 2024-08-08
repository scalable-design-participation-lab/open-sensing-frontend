<!-- <template>
  <aside class="filter-sidebar">
    <div class="filter-header">
      <h2 class="filter-title">Filters</h2>
      <el-button class="close-button" circle @click="handleClose">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
    <div class="filter-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="(section, index) in filterSections"
          :key="index"
          :name="section.title"
        >
          <template #title>
            <span class="section-title">{{ section.title }}</span>
          </template>
          <el-checkbox-group
            v-model="selectedOptions[section.title]"
            @change="handleFilterChange"
          >
            <el-checkbox
              v-for="option in section.options"
              :key="option"
              :label="option"
            >
              {{ option }}
            </el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
        <el-collapse-item name="Time">
          <template #title>
            <span class="section-title">Time Range</span>
          </template>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            style="width: 100%"
            @change="handleDateChange"
          />
          <div class="time-options">
            <el-button
              v-for="option in timeOptions"
              :key="option"
              :class="{ 'is-active': selectedTimeOption === option }"
              @click="selectTimeOption(option)"
            >
              {{ option }}
            </el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </aside>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import { Close } from '@element-plus/icons-vue'

const store = useDashboardUIStore()
const { closeFilter } = store

const activeNames = ref(['Location'])
const dateRange = ref([])
const selectedTimeOption = ref(null)

const filterSections = [
  {
    title: 'Location',
    options: [
      'Architecture Studios',
      'Cabot Center',
      'Cargill Hall',
      'Carter Playground',
      'Centennial Common',
      'Columbus Garage',
      'Curry Student Center',
      'Forsyth Building',
      'Gainsborough Garage',
      'Gainsborough Garage Roof',
      'ISEC Terrace',
      'Matthews Arena',
      'Robinson Hall',
      'Snell Library Quad',
    ],
  },
  {
    title: 'Data',
    options: ['Temperature', 'Humidity', 'Air Pollution'],
  },
  {
    title: 'Status',
    options: ['Active', 'Inactive', 'Conflict'],
  },
]

const selectedOptions = reactive({
  Location: [],
  Data: [],
  Status: [],
})

const timeOptions = [
  'today',
  'last 24h',
  'last 7 days',
  'last 14 days',
  'last 30 days',
  'last 365 days',
]

const selectTimeOption = (option) => {
  selectedTimeOption.value = option
  handleFilterChange()
}

const handleFilterChange = () => {
  console.log(
    'Filters changed',
    selectedOptions,
    dateRange.value,
    selectedTimeOption.value
  )
}

const handleDateChange = () => {
  handleFilterChange()
}

const handleClose = () => {
  closeFilter()
}

watch(selectedOptions, handleFilterChange, { deep: true })
</script>

<style scoped>
.filter-sidebar {
  background-color: #ffffff;
  width: 100%;
  max-width: 350px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.filter-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-button {
  padding: 8px;
  font-size: 18px;
}

.filter-content {
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
}

.time-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.time-options .el-button {
  flex: 1 0 calc(33.333% - 8px);
}

.time-options .el-button.is-active {
  background-color: #409eff;
  color: white;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: 500;
  border-bottom: none;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 16px;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
}

@media (max-width: 768px) {
  .filter-sidebar {
    max-width: none;
    width: 100%;
  }
}
</style> -->
<template>
  <transition name="fade">
    <aside v-if="showFilter" class="filter-sidebar-card">
      <div class="filter-header">
        <h2>Filters</h2>
        <el-button class="close-button" circle @click="closeFilter">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      <el-scrollbar>
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item name="1">
            <template #title>
              <span class="collapse-title">LOCATION SELECTION</span>
            </template>
            <el-checkbox-group
              v-model="selectedLocations"
              class="checkbox-group"
            >
              <el-checkbox
                v-for="(isActive, name) in existingHubs"
                :key="name"
                :label="name"
                @change="() => toggleHub(name)"
              >
                {{ name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template #title>
              <span class="collapse-title">DATA SELECTIONS</span>
            </template>
            <el-checkbox-group
              v-model="selectedDatasets"
              class="checkbox-group"
            >
              <el-checkbox
                v-for="(isActive, dataset) in existingDatasets"
                :key="dataset"
                :label="dataset"
              >
                {{ dataset }}
              </el-checkbox>
            </el-checkbox-group>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template #title>
              <span class="collapse-title">DATE & TIME</span>
            </template>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="to"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              style="width: 100%; margin-bottom: 15px"
              @change="handleDateChange"
            />
            <div class="time-range">
              <span>Time Range:</span>
              <el-slider
                v-model="timeRange"
                range
                :min="0"
                :max="24"
                :step="0.5"
                :format-tooltip="formatTimeTooltip"
              />
            </div>
            <div class="preset-date-filters">
              <el-button
                v-for="option in timeOptions"
                :key="option"
                class="date-filter-button"
                @click="applyDateFilter(option)"
              >
                {{ option }}
              </el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </aside>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import { Close } from '@element-plus/icons-vue'

const store = useDashboardUIStore()
const { existingHubs, existingDatasets, dataDashboardValues, showFilter } =
  storeToRefs(store)
const {
  toggleHub,
  closeFilter,
  updateDataDashboardValues,
  updateDateRangeUpdate,
} = store

const activeNames = ref(['1'])
const selectedLocations = ref([])
const selectedDatasets = ref([])

const dateRange = computed({
  get: () => dataDashboardValues.value.dateRange,
  set: (value) => updateDataDashboardValues('dateRange', value),
})

const timeRange = computed({
  get: () => dataDashboardValues.value.time,
  set: (value) => updateDataDashboardValues('time', value),
})

const timeOptions = [
  'Last 24 Hours',
  'Last 7 Days',
  'Last 30 Days ',
  'Last 365 Days',
]

const formatTimeTooltip = (val) => {
  const hours = Math.floor(val)
  const minutes = Math.floor((val % 1) * 60)
    .toString()
    .padStart(2, '0')
  return `${hours}:${minutes}`
}

const applyDateFilter = (period) => {
  const endDate = new Date()
  let startDate = new Date(endDate)

  switch (period) {
    case 'Last 24 Hours':
      startDate.setDate(endDate.getDate() - 1)
      break
    case 'Last 7 Days':
      startDate.setDate(endDate.getDate() - 7)
      break
    case 'Last 30 Days':
      startDate.setDate(endDate.getDate() - 30)
      break
    case 'Last 365 Days':
      startDate.setDate(endDate.getDate() - 365)
      break
  }

  updateDataDashboardValues('dateRange', [startDate, endDate])
  updateDateRangeUpdate(new Date())
}

const handleDateChange = () => {
  updateDateRangeUpdate(new Date())
}

watch(selectedLocations, (newValue) => {
  Object.keys(existingHubs.value).forEach((hub) => {
    existingHubs.value[hub] = newValue.includes(hub)
  })
})

watch(selectedDatasets, (newValue) => {
  Object.keys(existingDatasets.value).forEach((dataset) => {
    existingDatasets.value[dataset] = newValue.includes(dataset)
  })
})

// Initialize selectedLocations and selectedDatasets
selectedLocations.value = Object.keys(existingHubs.value).filter(
  (hub) => existingHubs.value[hub]
)
selectedDatasets.value = Object.keys(existingDatasets.value).filter(
  (dataset) => existingDatasets.value[dataset]
)
</script>

<style scoped>
.filter-sidebar-card {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 320px;
  max-height: calc(100vh - 40px);
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eaeaea;
}

.filter-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-button {
  padding: 8px;
  font-size: 18px;
}

:deep(.el-scrollbar__wrap) {
  max-height: calc(100vh - 120px);
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  font-size: 15px;
  font-weight: 600;
  color: #409eff;
  padding: 12px 20px;
}

:deep(.el-collapse-item__content) {
  padding: 0 20px 15px;
}

.collapse-title {
  font-size: 15px;
  font-weight: 600;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

:deep(.el-checkbox__label) {
  font-size: 14px;
}

.time-range {
  margin-bottom: 15px;
}

.preset-date-filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.date-filter-button {
  font-size: 12px;
  padding: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
