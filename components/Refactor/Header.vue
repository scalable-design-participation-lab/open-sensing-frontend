<!-- <template>
  <header class="w-full bg-white dark:bg-gray-900 py-8 shadow-md">
    <UContainer class="flex justify-between items-center">
      <div class="flex space-x-4">
        <UButton
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          :class="[
            'rounded-full px-8 py-4 text-xl font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md',
            link.primary
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
          ]"
        >
          {{ link.label }}
        </UButton>
      </div>
      <div class="flex items-center space-x-4">
        <UButton
          to="/draw"
          class="rounded-full px-8 py-4 text-xl font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          → Draw
        </UButton>
        <UColorModeButton
          class="p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          :ui="{
            icon: {
              base: 'w-7 h-7',
            },
          }"
        />
        <UAvatar
          src="https://avatars.githubusercontent.com/u/739984?v=4"
          alt="Avatar"
          size="lg"
          class="rounded-full"
        />
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
defineProps({
  links: {
    type: Array,
    required: true,
  },
})
</script> -->

<template>
  <GeneralizedHeader
    :left-items="leftItems"
    :right-items="rightItems"
    :show-color-mode-button="true"
    :show-avatar="true"
    avatar-src="https://avatars.githubusercontent.com/u/739984?v=4"
    avatar-alt="User Avatar"
  />
</template>

<script setup lang="ts">
import GeneralizedHeader from './GeneralizedHeader.vue'

const leftItems = [
  { label: 'Drawing Together', to: '/', primary: true },
  { label: 'Project Name', to: '/project' },
  { label: 'Learn', to: '/learn' },
]

const rightItems = [{ label: '→ Draw', to: '/draw' }]
</script>
