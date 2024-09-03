<template>
  <div v-if="isVisible" class="filter-sidebar-wrapper">
    <UCard
      :ui="{
        base: 'overflow-hidden bg-white shadow-lg rounded-lg',
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

      <UAccordion
        :items="filterSections"
        :ui="{
          wrapper: 'divide-y divide-gray-200',
          item: {
            base: 'filter-box transition-all duration-200 ease-in-out hover:-translate-y-0.5',
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
              :is="item.component"
              v-bind="item.props"
              @filter-change="handleFilterChange"
            />
          </UCard>
        </template>
      </UAccordion>

      <template #footer>
        <div class="flex justify-end space-x-2">
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
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
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

const emit = defineEmits(['close', 'reset', 'filter-change'])

const onClose = () => {
  emit('close')
}

const onReset = () => {
  emit('reset')
}

const handleFilterChange = (filterData) => {
  emit('filter-change', filterData)
}
</script>

<style scoped>
.filter-sidebar {
  width: 340px;
  max-height: 85vh;
  background-color: white;
  pointer-events: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 1rem;
  overflow: hidden;
}

@media (min-width: 640px) {
  .filter-sidebar {
    width: 360px;
  }
}

.filter-box {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
}
</style>
