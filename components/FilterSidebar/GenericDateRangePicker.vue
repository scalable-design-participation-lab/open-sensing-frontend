<template>
  <div>
    <UDatePicker
      v-model="dateRange"
      range
      :placeholder="placeholder"
      class="mb-4 w-full"
      @update:model-value="handleDateChange"
    />
    <div class="preset-date-filters">
      <UButton
        v-for="option in presetOptions"
        :key="option.label"
        size="sm"
        class="date-filter-button"
        @click="() => applyDateFilter(option.value)"
      >
        {{ option.label }}
      </UButton>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select date range',
  },
  presetOptions: {
    type: Array,
    default: () => [
      { label: 'Last 24 Hours', value: 1 },
      { label: 'Last 7 Days', value: 7 },
      { label: 'Last 30 Days', value: 30 },
      { label: 'Last 365 Days', value: 365 },
    ],
  },
})

const emit = defineEmits(['update:modelValue'])

const dateRange = ref(props.modelValue)

watch(dateRange, (newValue) => {
  emit('update:modelValue', newValue)
})

const handleDateChange = () => {
  emit('update:modelValue', dateRange.value)
}

const applyDateFilter = (days) => {
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(endDate.getDate() - days)
  dateRange.value = [startDate, endDate]
  handleDateChange()
}
</script>

<style scoped>
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
