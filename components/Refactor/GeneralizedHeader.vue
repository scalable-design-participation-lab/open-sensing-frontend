<template>
  <header
    :class="[
      'w-full bg-white dark:bg-gray-900 py-8 shadow-md',
      { 'absolute top-6 left-6 right-6 z-50': isAbsolute },
    ]"
  >
    <UContainer :class="['flex justify-between items-center', containerClass]">
      <div class="nav-left flex items-center space-x-4">
        <slot name="logo">
          <div class="logo-placeholder">Logo</div>
        </slot>
        <template v-for="(item, index) in leftItems" :key="index">
          <component
            :is="item.component || 'UButton'"
            v-bind="item.props"
            :class="[
              'flex items-center justify-center transition-all duration-200 ease-in-out hover:-translate-y-1',
              item.class,
              {
                'rounded-full px-8 py-4 text-xl font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md':
                  item.component === 'UButton',
                'bg-black text-white hover:bg-gray-800': item.primary,
                'bg-gray-100 text-black hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600':
                  !item.primary,
              },
            ]"
            @click="item.onClick"
          >
            <template v-if="item.icon">
              <component :is="item.icon" />
            </template>
            {{ item.label }}
          </component>
        </template>
      </div>
      <div class="nav-right flex items-center space-x-4">
        <template v-for="(item, index) in rightItems" :key="index">
          <component
            :is="item.component || 'UButton'"
            v-bind="item.props"
            :class="[
              'flex items-center justify-center transition-all duration-200 ease-in-out hover:-translate-y-1',
              item.class,
              {
                'rounded-full px-8 py-4 text-xl font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md':
                  item.component === 'UButton',
              },
            ]"
            @click="item.onClick"
          >
            <template v-if="item.icon">
              <component :is="item.icon" />
            </template>
            {{ item.label }}
          </component>
        </template>
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

interface HeaderItem {
  component?: string
  label?: string
  icon?: any
  class?: string
  props?: any
  primary?: boolean
  onClick?: () => void
}

const props = defineProps({
  isAbsolute: {
    type: Boolean,
    default: false,
  },
  containerClass: {
    type: String,
    default: '',
  },
  leftItems: {
    type: Array as PropType<HeaderItem[]>,
    default: () => [],
  },
  rightItems: {
    type: Array as PropType<HeaderItem[]>,
    default: () => [],
  },
  showColorModeButton: {
    type: Boolean,
    default: true,
  },
  showAvatar: {
    type: Boolean,
    default: false,
  },
  avatarSrc: {
    type: String,
    default: '',
  },
  avatarAlt: {
    type: String,
    default: 'User Avatar',
  },
})
</script>

<style scoped>
@media (max-width: 1024px) {
  .header.is-absolute {
    @apply flex-col items-start top-4 left-4;
  }

  .nav-right {
    @apply mt-4;
  }
}

@media (max-width: 768px) {
  .header.is-absolute {
    @apply top-3 left-3 right-3;
  }

  .nav-left,
  .nav-right {
    @apply gap-3;
  }
}
</style>
