<script lang="ts" setup>
import { provide } from 'vue'
import { ZINDEX_INJECTION_KEY, ID_INJECTION_KEY } from 'element-plus'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// Provide z-index for Element Plus
provide(ZINDEX_INJECTION_KEY, {
  current: 0,
})

provide(ID_INJECTION_KEY, {
  prefix: Math.floor(Math.random() * 10000),
  current: 0,
})
// Use Element Plus
useNuxtApp().vueApp.use(ElementPlus)

// Add Tailwind CSS
useHead({
  script: [
    {
      src: 'https://cdn.tailwindcss.com',
      defer: true,
    },
  ],
  link: [
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/element-plus/dist/index.css',
    },
  ],
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
