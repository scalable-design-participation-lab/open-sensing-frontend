<template>
  <div v-if="isVisible" class="pointer-events-auto">
    <UCard
      :ui="{
        base: 'overflow-visible bg-white shadow-lg rounded-lg w-[340px] sm:w-[360px] max-h-[85vh]',
        header: { padding: 'px-6 py-4' },
        body: { base: 'overflow-y-auto px-6 py-4' },
        footer: { padding: 'px-6 py-4' },
      }"
      class="filter-sidebar"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">{{ title }}</h2>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            @click="onClose"
          />
        </div>
      </template>

      <slot name="before-filters"></slot>

      <UAccordion
        :items="filterSections"
        :ui="{
          wrapper: 'divide-y divide-gray-200',
          item: {
            base: 'shadow-sm mb-2 rounded-md transition-all duration-200 ease-in-out hover:-translate-y-0.5',
            trigger:
              'bg-gray-50 hover:bg-gray-100 rounded-md p-2 transition-colors duration-200',
            content: 'p-4',
          },
          icon: 'text-blue-500',
        }"
      >
        <template #item="{ item }">
          <UCard
            :ui="{
              base: 'bg-white shadow-sm rounded-lg mb-4',
              body: { padding: 'p-4' },
            }"
          >
            <component
              :is="resolveComponent(item.component)"
              v-bind="item.props"
              @update:model-value="
                (value) => handleFilterChange(item.name, value)
              "
            />
          </UCard>
        </template>
      </UAccordion>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <slot name="footer-buttons">
            <UButton
              color="blue"
              variant="soft"
              class="transition-colors duration-200 hover:bg-blue-600 hover:text-white"
              @click="onReset"
            >
              <template #leading>
                <UIcon name="i-heroicons-arrow-path" />
              </template>
              Reset
            </UButton>
          </slot>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import GenericCheckboxGroup from './GenericCheckboxGroup.vue'
import GenericDateRangePicker from './GenericDateRangePicker.vue'

defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Filters',
  },
  filterSections: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['close', 'reset', 'filter-change', 'download'])

const onClose = () => {
  emit('close')
}

const onReset = () => {
  emit('reset')
}

const handleFilterChange = (name, value) => {
  emit('filter-change', { name, value })
}

const resolveComponent = (componentName) => {
  switch (componentName) {
    case 'GenericCheckboxGroup':
      return GenericCheckboxGroup
    case 'GenericDateRangePicker':
      return GenericDateRangePicker
    default:
      return defineAsyncComponent(() => import(`./${componentName}.vue`))
  }
}
</script>
