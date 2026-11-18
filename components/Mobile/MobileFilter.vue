<!--
 * MobileFilter Component
 *
 * Filter sheet body for the mobile layout (Figma: Mobile / 03-filter).
 * Reads current filter state from the stores and emits the same
 * `filter-change` payloads as GenericFilterSidebar, so the page handles
 * both with one handler.
 *
 * @displayName MobileFilter
 * @usage
 * <MobileFilter :date-range="selected" @filter-change="handleFilterChange" />
 -->
<template>
  <div
    class="flex flex-col gap-6 overflow-y-auto pl-8 pr-2 text-[15px] leading-[18px]"
  >
    <fieldset v-for="group in groups" :key="group.name">
      <legend class="mb-3 text-[13px]">{{ group.label }}</legend>
      <label
        v-for="item in group.items"
        :key="item.label"
        class="-ml-8 flex items-center gap-5 py-0.5"
      >
        <input
          type="checkbox"
          class="h-3 w-3 shrink-0 appearance-none rounded-full border border-black bg-none p-0 text-black checked:bg-black focus:ring-0 focus:ring-offset-0 dark:border-white dark:text-white dark:checked:bg-white"
          :checked="item.checked"
          @change="toggle(group, item.label)"
        />
        {{ item.label }}
      </label>
    </fieldset>

    <fieldset>
      <legend class="mb-3 text-[13px]">Time</legend>
      <div class="-ml-4 flex items-center gap-2 text-[13px]">
        <input
          type="date"
          aria-label="From"
          class="chip min-w-0 flex-1"
          :value="toInput(dateRange?.start)"
          :max="toInput(dateRange?.end)"
          @change="setDate('start', $event.target.value)"
        />
        <UIcon name="i-heroicons-arrow-right" class="shrink-0" />
        <input
          type="date"
          aria-label="To"
          class="chip min-w-0 flex-1"
          :value="toInput(dateRange?.end)"
          :min="toInput(dateRange?.start)"
          @change="setDate('end', $event.target.value)"
        />
      </div>
      <div class="-ml-4 mt-3 grid grid-cols-2 gap-2 text-[13px]">
        <button
          v-for="preset in presets"
          :key="preset.label"
          type="button"
          class="chip"
          @click="emitRange(preset.start(), new Date())"
        >
          {{ preset.label }}
        </button>
      </div>
    </fieldset>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format, isValid, startOfDay, endOfDay, sub } from 'date-fns'
import { useSensorDetailStore } from '../../stores/sensorDetail'
import { useDatasetStore } from '../../stores/datasets'

const props = defineProps({
  dateRange: { type: Object, default: null },
})
const emit = defineEmits(['filter-change'])

const sensorDetailStore = useSensorDetailStore()
const datasetStore = useDatasetStore()

const groups = computed(() => [
  {
    name: 'location',
    label: 'Location',
    items: sensorDetailStore.availableLocations.map((label) => ({
      label,
      checked: sensorDetailStore.filteredLocations.includes(label),
    })),
  },
  {
    name: 'datasets',
    label: 'Data',
    items: Object.entries(datasetStore.existingDatasets).map(
      ([label, checked]) => ({ label, checked })
    ),
  },
])

const toggle = (group, label) =>
  emit('filter-change', {
    name: group.name,
    value: Object.fromEntries(
      group.items.map((i) => [
        i.label,
        i.label === label ? !i.checked : i.checked,
      ])
    ),
  })

const presets = [
  { label: 'today', start: () => startOfDay(new Date()) },
  { label: 'last 24h', start: () => sub(new Date(), { hours: 24 }) },
  { label: 'last 7 days', start: () => sub(new Date(), { days: 7 }) },
  { label: 'last 14 days', start: () => sub(new Date(), { days: 14 }) },
  { label: 'last 30 days', start: () => sub(new Date(), { days: 30 }) },
  { label: 'last 365 days', start: () => sub(new Date(), { days: 365 }) },
]

const toInput = (date) => (isValid(date) ? format(date, 'yyyy-MM-dd') : '')

const emitRange = (start, end) =>
  emit('filter-change', { name: 'datetime', value: { start, end } })

function setDate(edge, value) {
  if (!value) return
  // "yyyy-MM-ddT00:00" parses as local time; a bare date would parse as UTC
  const day = new Date(`${value}T00:00`)
  const start = edge === 'start' ? startOfDay(day) : props.dateRange?.start
  const end = edge === 'end' ? endOfDay(day) : props.dateRange?.end
  emitRange(
    isValid(start) ? start : startOfDay(day),
    isValid(end) ? end : new Date()
  )
}
</script>

<style scoped>
.chip {
  height: 28px;
  border: 1px solid color-mix(in srgb, currentColor 60%, transparent);
  border-radius: 6px;
  background: transparent;
  padding: 0 8px;
  font-size: 13px;
  line-height: 1;
  text-align: center;
}
/* Light calendar icon on the native date inputs */
.dark .chip {
  color-scheme: dark;
}
</style>
