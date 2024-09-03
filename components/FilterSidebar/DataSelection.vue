<template>
  <UCheckboxGroup v-model="selectedDatasets" class="checkbox-group">
    <UCheckbox
      v-for="(isActive, dataset) in existingDatasets"
      :key="dataset"
      :label="dataset"
      :model-value="isActive"
      @update:model-value="handleDatasetChange(dataset, $event)"
    >
      {{ dataset }}
    </UCheckbox>
  </UCheckboxGroup>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const store = useDashboardUIStore()
const { existingDatasets } = storeToRefs(store)
const { updateExistingDatasets, updateDateRangeUpdate } = store

const selectedDatasets = computed({
  get: () =>
    Object.keys(existingDatasets.value).filter(
      (dataset) => existingDatasets.value[dataset]
    ),
  set: (newValue) => {
    Object.keys(existingDatasets.value).forEach((dataset) => {
      existingDatasets.value[dataset] = newValue.includes(dataset)
    })
  },
})

const handleDatasetChange = (dataset, value) => {
  updateExistingDatasets(dataset, value)
  updateDateRangeUpdate(new Date())
}
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
