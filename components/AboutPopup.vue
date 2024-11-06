<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-xl' }">
    <UCard>
      <!-- Header -->
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">About This Project</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="closeModal"
          />
        </div>
      </template>

      <!-- Content -->
      <div class="space-y-4">
        <p>
          This is a participatory mapping project that aims to understand how
          people use and experience urban spaces.
        </p>

        <div class="space-y-2">
          <h4 class="font-medium">Key Features:</h4>
          <ul class="list-disc list-inside space-y-1 pl-4">
            <li>Draw and mark locations you frequently visit</li>
            <li>Share your experiences about safety and belonging</li>
            <li>Contribute to environmental observations</li>
            <li>View collective community input</li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="font-medium">How to Participate:</h4>
          <p>
            Use the tools on the left sidebar to mark locations and share your
            experiences. Your input helps create a better understanding of our
            community spaces.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <template #footer>
        <div class="flex justify-end">
          <UButton color="gray" variant="solid" @click="closeModal">
            Close
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const closeModal = () => {
  isOpen.value = false
}
</script>
