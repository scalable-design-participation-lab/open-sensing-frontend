<!--
 * GeneralizedHeader Component
 * 
 * This component renders a customizable header with logo, navigation items,
 * and action buttons. It's designed to be used across different pages of the application
 * and supports responsive design.
 * 
 * @displayName GeneralizedHeader
 * @usage
 * <GeneralizedHeader
 *   :leftItems="navItems"
 *   :rightItems="actionItems"
 *   logoSrc="/logo.png"
 *   logoAlt="Company Logo"
 *   :showIcon="true"
 *   shape="rounded"
 * />
 -->

<template>
  <header
    class="fixed top-8 left-8 right-8 flex justify-between items-center z-50"
  >
    <div class="flex items-center space-x-2 sm:space-x-3">
      <UButton
        v-if="logoSrc"
        variant="outline"
        color="gray"
        :class="[
          `h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 p-0 backdrop-blur-md bg-white/90 flex items-center justify-center transition-all duration-300 hover:bg-gray-100`,
          shapeClass,
        ]"
      >
        <img
          :src="logoSrc"
          :alt="logoAlt"
          class="w-6 sm:w-7 md:w-8 lg:w-10 h-auto"
        />
      </UButton>
      <UButton
        v-if="showIcon"
        color="gray"
        :class="[
          `h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 text-xl sm:text-2xl md:text-3xl backdrop-blur-md bg-white flex items-center justify-center border-2 border-gray-300 shadow-md transition-all duration-300 hover:text-white hover:border-black`,
          shapeClass,
        ]"
      >
        🤲
      </UButton>
      <template v-for="(item, index) in leftItems" :key="index">
        <NuxtLink v-if="item.to" v-slot="{ navigate }" :to="item.to" custom>
          <UButton
            :variant="item.variant || (item.primary ? 'solid' : 'outline')"
            :color="item.color || (item.primary ? 'black' : 'gray')"
            :icon="item.icon"
            :class="[
              `h-8 sm:h-10 md:h-12 lg:h-14 px-3 sm:px-4 md:px-5 lg:px-6 text-xs sm:text-sm md:text-base lg:text-lg rounded-full transition-all duration-300`,
              item.primary
                ? 'bg-white text-black hover:bg-black hover:text-white hover:border hover:border-white'
                : 'bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black',
              shapeClass,
            ]"
            @click="navigate"
          >
            {{ item.label }}
          </UButton>
        </NuxtLink>
        <UButton
          v-else
          :variant="item.variant || (item.primary ? 'solid' : 'outline')"
          :color="item.color || (item.primary ? 'black' : 'gray')"
          :icon="item.icon"
          :class="[
            `h-8 sm:h-10 md:h-12 lg:h-14 px-3 sm:px-4 md:px-5 lg:px-6 text-xs sm:text-sm md:text-base lg:text-lg rounded-full transition-all duration-300`,
            item.primary
              ? 'bg-white text-black hover:bg-black hover:text-white hover:border hover:border-white'
              : 'bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black',
            shapeClass,
          ]"
          @click="item.onClick"
        >
          {{ item.label }}
        </UButton>
      </template>
    </div>
    <div class="flex items-center space-x-2 sm:space-x-3">
      <template v-for="(item, index) in rightItems" :key="index">
        <UDropdown v-if="item.dropdown" v-bind="item.dropdown">
          <UButton
            :variant="item.variant || 'outline'"
            :color="item.color || 'gray'"
            :icon="item.icon"
            :class="[
              `h-8 sm:h-10 md:h-12 lg:h-14 px-3 sm:px-4 md:px-5 lg:px-6 text-xs sm:text-sm md:text-base lg:text-lg rounded-full transition-all duration-300 bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black`,
              shapeClass,
            ]"
          >
            {{ item.label }}
          </UButton>
        </UDropdown>
        <NuxtLink
          v-else-if="item.to"
          v-slot="{ navigate }"
          :to="item.to"
          custom
        >
          <UButton
            :variant="item.variant || 'outline'"
            :color="item.color || 'gray'"
            :icon="item.icon"
            :class="[
              `h-8 sm:h-10 md:h-12 lg:h-14 px-3 sm:px-4 md:px-5 lg:px-6 text-xs sm:text-sm md:text-base lg:text-lg rounded-full transition-all duration-300 bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black`,
              shapeClass,
            ]"
            @click="navigate"
          >
            {{ item.label }}
          </UButton>
        </NuxtLink>
        <UButton
          v-else
          :variant="item.variant || 'outline'"
          :color="item.color || 'gray'"
          :icon="item.icon"
          :class="[
            `h-8 sm:h-10 md:h-12 lg:h-14 px-3 sm:px-4 md:px-5 lg:px-6 text-xs sm:text-sm md:text-base lg:text-lg rounded-full transition-all duration-300 bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black`,
            shapeClass,
          ]"
          @click="item.onClick"
        >
          {{ item.label }}
        </UButton>
      </template>
    </div>
  </header>
</template>
<script setup>
import { computed } from 'vue'

/**
 * Props for the GeneralizedHeader component
 * @typedef {Object} GeneralizedHeaderProps
 * @property {Array<{label: string, to?: string, onClick?: Function, variant?: string, color?: string, icon?: string, primary?: boolean}>} leftItems - Items for the left side of the header
 * @property {Array<{label: string, to?: string, onClick?: Function, variant?: string, color?: string, icon?: string, dropdown?: Object}>} rightItems - Items for the right side of the header
 * @property {string} [logoSrc] - Source URL for the logo image
 * @property {string} [logoAlt='Logo'] - Alt text for the logo image
 * @property {boolean} [showIcon=true] - Whether to show the icon
 * @property {'rounded' | 'rectangular'} [shape='rounded'] - Shape of the buttons and logo
 */

/**
 * Component props
 * @type {GeneralizedHeaderProps}
 */
const props = defineProps({
  leftItems: {
    type: Array,
    default: () => [],
  },
  rightItems: {
    type: Array,
    default: () => [],
  },
  logoSrc: {
    type: String,
    default: '',
  },
  logoAlt: {
    type: String,
    default: 'Logo',
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  shape: {
    type: String,
    default: 'rounded',
    validator: (value) => ['rounded', 'rectangular'].includes(value),
  },
})

/**
 * Computed property to determine the shape class
 * @type {import('vue').ComputedRef<string>}
 */
const shapeClass = computed(() => {
  switch (props.shape) {
    case 'rectangular':
      return 'rounded-2xl'
    case 'rounded':
    default:
      return 'rounded-full'
  }
})
</script>
