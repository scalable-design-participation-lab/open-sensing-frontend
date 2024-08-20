<template>
  <header class="bg-white dark:bg-gray-900 py-8 shadow-md">
    <UContainer class="flex justify-between items-center">
      <div class="flex space-x-4">
        <UButton
          v-for="link in leftItems"
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
          v-for="link in rightItems"
          :key="link.label"
          :to="link.to"
          class="rounded-full px-8 py-4 text-xl font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          {{ link.label }}
        </UButton>
        <UColorModeButton
          v-if="showColorModeButton"
          class="p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          :ui="{
            icon: {
              base: 'w-7 h-7',
            },
          }"
        />
        <UAvatar
          v-if="showAvatar"
          :src="avatarSrc"
          :alt="avatarAlt"
          size="lg"
          class="rounded-full"
        />
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

interface HeaderLink {
  label: string
  to: string
  primary?: boolean
}

const props = defineProps({
  leftItems: {
    type: Array as PropType<HeaderLink[]>,
  },
  rightItems: {
    type: Array as PropType<HeaderLink[]>,
  },
  showColorModeButton: {
    type: Boolean,
    default: true,
  },
  showAvatar: {
    type: Boolean,
    default: true,
  },
  avatarSrc: {
    type: String,
    default: 'https://avatars.githubusercontent.com/u/739984?v=4',
  },
  avatarAlt: {
    type: String,
    default: 'User Avatar',
  },
})

const uiConfig = {
  // Add any global UI configurations here
}
</script>
