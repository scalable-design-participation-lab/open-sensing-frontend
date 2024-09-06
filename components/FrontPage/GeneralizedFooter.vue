<template>
  <footer
    class="absolute bottom-6 left-6 right-6 flex justify-between items-end z-20 sm:flex-row sm:items-end flex-col items-start"
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
        class="w-14 h-14 sm:w-14 sm:h-14 rounded-2xl bg-white bg-opacity-90 border-none flex items-center justify-center font-semibold text-lg sm:text-xl text-gray-700 cursor-pointer transition-all duration-200 ease-in-out shadow-md hover:bg-white hover:shadow-lg hover:-translate-y-1"
        aria-label="Help"
      >
        ?
      </button>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  links: Array,
  buttons: Array,
})
</script>
