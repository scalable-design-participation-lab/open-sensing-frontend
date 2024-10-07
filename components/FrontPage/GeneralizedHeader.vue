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
    class="h-10 lg:h-12 fixed top-6 left-6 right-6 flex justify-between z-50"
  >
    <div class="h-full flex space-x-2 sm:space-x-3">
      <UButton
        v-if="logoSrc"
        color="gray"
        :class="[
          `md:w-14 lg:w-14 rounded-lg flex justify-center  bg-white hover:animate-bounce`,
          shapeClass,
        ]"
      >
        <img
          :src="logoSrc"
          :alt="logoAlt"
          class="w-11/12 h-auto"
        />
      </UButton>
      <UButton
        v-if="showIcon"
        color="gray"
        :class="[
          `md:w-14 text-xl sm:text-2xl rounded-lg flex justify-center shadow-md hover:animate-bounce`,
          shapeClass,
        ]"
      >
        🤲
      </UButton>
      <template v-for="(item, index) in leftItems" :key="index">
        <NuxtLink v-if="item.to" v-slot="{ navigate }" :to="item.to" custom>
          <UButton
            :variant="item.variant"
            :color="item.color || (item.primary ? 'black' : 'gray')"
            :icon="item.icon"
            :class="[
              `h-full sm:h-10 md:h-12 px-3 sm:px-4 md:px-5 text-xs sm:text-sm md:text-base lg:text-lg rounded-full`,
              item.primary
                ? 'bg-white text-black hover:bg-black hover:text-white'
                : 'bg-black text-white hover:bg-white hover:text-black',
              shapeClass,
            ]"
            @click="navigate"
          >
            {{ item.label }}
          </UButton>
        </NuxtLink>
        <UButton
          v-else
          :variant="item.variant"
          :color="item.color || (item.primary ? 'black' : 'gray')"
          :icon="item.icon"
          :class="[
            `h-full px-3 sm:px-4 rounded-lg text-xs sm:text-sm md:text-base lg:text-lg hover:animate-pulse`,
            item.primary
              ? '!bg-white text-black'
              : '!bg-black text-white',
            shapeClass,
          ]"
          @click="item.onClick"
        >
          {{ item.label }}
        </UButton>
      </template>
    </div>
    <div class="flex space-x-2 sm:space-x-3">
      <template v-for="(item, index) in rightItems" :key="index">
        <UDropdown v-if="item.dropdown" v-bind="item.dropdown">
          <UButton
            :icon="item.icon"
            :class="[
              `h-full px-3 sm:px-4 md:px-5 lg:px-6 text-xs sm:text-sm md:text-base lg:text-lg rounded-full !bg-white text-black hover:invert`,
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
            :variant="item.variant"
            :color="item.color"
            :icon="item.icon"
            :class="[
              `h-full px-3 sm:px-4 md:px-5 lg:px-6 text-xs sm:text-sm md:text-base lg:text-lg rounded-full !bg-white text-black hover:invert`,
              shapeClass,
            ]"
            @click="navigate"
          >
            {{ item.label }}
          </UButton>
        </NuxtLink>
        <UButton
          v-else
          :icon="item.icon"
          :class="[
            `h-full px-3 sm:px-4 md:px-5 lg:px-6 text-xs sm:text-sm md:text-base lg:text-lg rounded-full !bg-white text-black hover:invert`,
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
 
const shapeClass = computed(() => {
  switch (props.shape) {
    case 'rectangular':
      return 'rounded-2xl'
    case 'rounded':
    default:
      return 'rounded-full'
  }
})
*/
</script>
