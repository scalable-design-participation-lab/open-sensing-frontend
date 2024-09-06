<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <GenericFilterSidebar
        :is-visible="true"
        title="Download Options"
        :filter-sections="filterSections"
        @close="$emit('close')"
        @filter-change="handleFilterChange"
        @download="handleDownload"
      >
        <template #before-filters>
          <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">File Format</h3>
            <div class="flex space-x-4">
              <URadio
                v-model="fileFormat"
                name="file-format"
                value="json"
                label="JSON"
                class="flex-1"
              />
              <URadio
                v-model="fileFormat"
                name="file-format"
                value="csv"
                label="CSV"
                class="flex-1"
              />
            </div>
          </div>
        </template>
        <template #footer-buttons>
          <UButton color="gray" variant="soft" @click="$emit('close')">
            Cancel
          </UButton>
          <UButton
            color="blue"
            variant="solid"
            class="transition-colors duration-200 hover:bg-blue-600 hover:text-white"
            @click="handleDownload"
          >
            <template #leading>
              <UIcon name="i-heroicons-arrow-down-tray" />
            </template>
            Download
          </UButton>
        </template>
      </GenericFilterSidebar>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import GenericFilterSidebar from './FilterSidebar/GenericFilterSidebar.vue'

const props = defineProps({
  filterSections: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['close', 'download'])

const selectedFilters = ref<Record<string, any>>({})
const fileFormat = ref<'json' | 'csv'>('json')

watch(
  () => props.filterSections,
  (newSections) => {
    newSections.forEach((section: any) => {
      selectedFilters.value[section.name] = section.props.modelValue
    })
  },
  { immediate: true }
)

const handleFilterChange = (filterData: { name: string; value: any }) => {
  const { name, value } = filterData
  selectedFilters.value[name] = value
}

const handleDownload = () => {
  console.log('Selected filters:', selectedFilters.value)
  console.log('File format:', fileFormat.value)
  emit('download', { filters: selectedFilters.value, format: fileFormat.value })
}
</script>
