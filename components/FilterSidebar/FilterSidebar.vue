<template>
  <UTransition name="slide-fade">
    <aside v-if="showFilter" class="filter-sidebar-card">
      <div class="filter-header">
        <h2>Filter</h2>
        <UButton
          icon="i-heroicons-x-mark"
          color="gray"
          variant="ghost"
          class="close-button"
          @click="closeFilter"
        />
      </div>
      <UScrollbar class="filter-content">
        <UAccordion
          v-model="activeNames"
          :items="accordionItems"
          :ui="accordionUI"
        >
          <template #default="{ item, open }">
            <div class="accordion-item" :class="{ 'is-open': open }">
              <div
                class="accordion-header"
                @click="toggleAccordion(item.label)"
              >
                <UIcon :name="item.icon" class="accordion-icon-left" />
                {{ item.label }}
                <UIcon
                  :name="
                    open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'
                  "
                  class="accordion-icon-right"
                />
              </div>
              <transition name="accordion">
                <div v-show="open" class="accordion-content">
                  <component :is="item.component" />
                </div>
              </transition>
            </div>
          </template>
        </UAccordion>
      </UScrollbar>
      <div class="filter-footer">
        <UButton color="primary" block @click="applyFilters">
          Apply Filter
        </UButton>
      </div>
    </aside>
  </UTransition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import LocationSelection from './LocationSelection.vue'
import DataSelection from './DataSelection.vue'
import DateTimeSelection from './DateTimeSelection.vue'

const store = useDashboardUIStore()
const { showFilter } = storeToRefs(store)
const { closeFilter } = store

const activeNames = ref([])

const accordionItems = [
  {
    label: 'Location Selection',
    component: LocationSelection,
    icon: 'i-heroicons-map-pin',
  },
  {
    label: 'Data Selection',
    component: DataSelection,
    icon: 'i-heroicons-chart-bar',
  },
  {
    label: 'Date and Time Selection',
    component: DateTimeSelection,
    icon: 'i-heroicons-calendar',
  },
]

const accordionUI = {
  wrapper: 'space-y-2',
  item: {
    base: 'overflow-hidden rounded-lg border border-gray-200 bg-white',
    active: 'ring-2 ring-primary-500',
  },
}

const toggleAccordion = (label) => {
  if (activeNames.value.includes(label)) {
    activeNames.value = activeNames.value.filter((name) => name !== label)
  } else {
    activeNames.value.push(label)
  }
}

const applyFilters = () => {
  console.log('Apply filters')
  closeFilter()
}
</script>

<style scoped>
.filter-sidebar-card {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 350px;
  height: calc(100vh - 40px);
  max-height: 600px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eaeaea;
}

.filter-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.close-button {
  transition: transform 0.3s ease;
}

.close-button:hover {
  transform: rotate(90deg);
}

.filter-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}

.accordion-item {
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.accordion-item.is-open {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.accordion-header:hover {
  background-color: #f0f0f0;
}

.accordion-icon-left {
  margin-right: 10px;
}

.accordion-icon-right {
  transition: transform 0.3s ease;
}

.is-open .accordion-icon-right {
  transform: rotate(180deg);
}

.accordion-content {
  padding: 15px;
  background-color: #ffffff;
  border-radius: 0 0 8px 8px;
}

.filter-footer {
  padding: 20px;
  border-top: 1px solid #eaeaea;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
