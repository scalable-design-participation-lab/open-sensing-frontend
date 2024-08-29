<template>
  <UDatePicker
    v-model="dateRange"
    range
    placeholder="Select date range"
    class="mb-4 w-full"
    @update:model-value="handleDateChange"
  />
  <div class="time-range">
    <span>Time Range:</span>
    <URange v-model="timeRange" :min="0" :max="24" :step="0.5" class="mt-2" />
  </div>
  <div class="preset-date-filters">
    <UButton
      v-for="option in timeOptions"
      :key="option"
      size="sm"
      class="date-filter-button"
      @click="() => applyDateFilter(option)"
    >
      {{ option }}
    </UButton>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const store = useDashboardUIStore()
const { dataDashboardValues } = storeToRefs(store)
const { updateDataDashboardValues, updateDateRangeUpdate } = store

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
</script>

<style scoped>
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
</style>
