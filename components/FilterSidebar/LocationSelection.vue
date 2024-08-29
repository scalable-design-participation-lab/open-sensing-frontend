<template>
  <UCheckboxGroup v-model="selectedLocations" class="checkbox-group">
    <UCheckbox
      v-for="(isActive, name) in existingHubs"
      :key="name"
      :label="name"
      :model-value="isActive"
      @update:model-value="() => toggleHub(name)"
    >
      {{ name }}
    </UCheckbox>
  </UCheckboxGroup>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const store = useDashboardUIStore()
const { existingHubs } = storeToRefs(store)
const { toggleHub } = store

const selectedLocations = computed({
  get: () =>
    Object.keys(existingHubs.value).filter((hub) => existingHubs.value[hub]),
  set: (newValue) => {
    Object.keys(existingHubs.value).forEach((hub) => {
      existingHubs.value[hub] = newValue.includes(hub)
    })
  },
})
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
