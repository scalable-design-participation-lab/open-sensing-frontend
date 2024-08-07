<template>
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
</style>
