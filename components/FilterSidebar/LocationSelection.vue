<template>
  <UCheckboxGroup v-model="selectedLocations" class="checkbox-group">
    <UCheckbox
      v-for="(isActive, name) in existingHubs"
      :key="name"
      :label="name"
      :model-value="isActive"
      @update:model-value="handleLocationChange(name, $event)"
    >
      {{ name }}
    </UCheckbox>
  </UCheckboxGroup>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const store = useDashboardUIStore()
const { existingHubs } = storeToRefs(store)
const { updateExistingHubs, updateDateRangeUpdate } = store

const selectedLocations = computed({
  get: () =>
    Object.keys(existingHubs.value || {}).filter(
      (hub) => existingHubs.value[hub]
    ),
  set: (newValue) => {
    if (existingHubs.value) {
      Object.keys(existingHubs.value).forEach((hub) => {
        updateExistingHubs(hub, newValue.includes(hub))
      })
    }
  },
})

const handleLocationChange = (name, value) => {
  updateExistingHubs(name, value)
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
