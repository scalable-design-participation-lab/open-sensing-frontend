<template>
  <UModal v-model="isOpen" :ui="{ width: 'w-96' }">
      <div class="space-y-3 p-6">
        <UButton
          v-for="(item, index) in menuItems"
          :key="index"
          block
          color="white"
          variant="solid"
          :icon="item.icon"
          class="dark:bg-slate-950 dark:text-white text-lg font-semibold rounded-full py-3"
          @click="handleItemClick(item)"
        >
          {{ item.label }}
        </UButton>
      </div>
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
    action: 'about',
    link: '/about',
  },
  {
    label: 'Help',
    action: 'help',
  },
  {
    label: 'Settings',
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
