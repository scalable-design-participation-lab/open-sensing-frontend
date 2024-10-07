<!--
 * GeneralizedFooter Component
 * 
 * This component renders a customizable footer with a title, navigation links,
 * and action buttons. It's designed to be used across different pages of the application.
 * 
 * @displayName GeneralizedFooter
 * @usage
 * <GeneralizedFooter
 *   title="Company Name"
 *   :links="footerLinks"
 *   :buttons="footerButtons"
 * />
 -->

<template>
  <footer
    class="fixed bottom-6 left-6 right-6 flex justify-between items-end sm:flex-row flex-col z-50"
  >
    <div class="footer-left">
      <h2 class="text-2xl">{{ title }}</h2>
      <nav class="mt-4">
        <ul class="space-y-2">
          <li v-for="link in links" :key="link.to">
            <ULink :to="link.to">{{ link.label }}</ULink>
          </li>
        </ul>
      </nav>
    </div>
    <div class="flex items-center gap-4 sm:mt-0 mt-4">
      <div class="flex gap-4">
        <UButton
          v-for="button in buttons"
          :key="button.label"
          color="gray"
          :label="button.label"
        />
      </div>
      <button
        class="w-12 h-12 rounded-full bg-white flex items-center justify-center font-semibold text-lg sm:text-xl cursor-pointer shadow-md hover:bg-white hover:animate-spin"
        aria-label="Help"
      >
        ?
      </button>
    </div>
  </footer>
</template>

<script setup lang="ts">
/**
 * Props for the GeneralizedFooter component
 * @typedef {Object} GeneralizedFooterProps
 * @property {string} title - The title displayed in the footer
 * @property {Array<{to: string, label: string}>} links - Navigation links for the footer
 * @property {Array<{label: string}>} buttons - Action buttons for the footer
 */

/**
 * Component props
 * @type {GeneralizedFooterProps}
 */
defineProps({
  title: String,
  links: Array,
  buttons: Array,
})
</script>
