<!-- LocationSelectorModal.vue -->
<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]"
  >
    <div class="bg-white p-6 rounded-lg w-80 shadow-xl">
      <h2 class="text-lg font-bold mb-4">Select a Location</h2>
      <ul class="space-y-2">
        <li
          v-for="loc in locations"
          :key="loc.value"
          class="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
          @click="$emit('select', loc.location)"
        >
          {{ loc.label }}
        </li>
      </ul>
      <button
        class="mt-4 text-sm text-gray-600 hover:underline"
        @click="$emit('close')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  locations: { label: string; value: string; location: [number, number] }[]
}>()

defineEmits<{
  (e: 'select', value: [number, number]): void
  (e: 'close'): void
}>()
</script>
