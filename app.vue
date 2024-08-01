<script lang="ts" setup>
import { provide } from 'vue'
import { ZINDEX_INJECTION_KEY } from 'element-plus'

provide(ZINDEX_INJECTION_KEY, {
  current: 0,
})
//firstcommit
useHead({
  script: [
    {
      src: 'https://cdn.tailwindcss.com',
    },
  ],
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
