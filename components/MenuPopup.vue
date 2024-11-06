<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-md' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">Menu</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="closeModal"
          />
        </div>
      </template>

      <div class="space-y-2">
        <UButton
          v-for="(item, index) in menuItems"
          :key="index"
          block
          color="gray"
          variant="soft"
          :icon="item.icon"
          class="justify-start text-lg"
          @click="handleItemClick(item)"
        >
          {{ item.label }}
        </UButton>
      </div>
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

const emit = defineEmits(['update:modelValue', 'select'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const menuItems = [
  {
    label: 'About',
    icon: 'i-heroicons-information-circle-20-solid',
    action: 'about',
  },
  {
    label: 'Help',
    icon: 'i-heroicons-question-mark-circle-20-solid',
    action: 'help',
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth-20-solid',
    action: 'settings',
  },
]

const closeModal = () => {
  isOpen.value = false
}

const handleItemClick = (item) => {
  emit('select', item.action)
  closeModal()
}
</script>
