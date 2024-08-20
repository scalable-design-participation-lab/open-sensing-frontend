<template>
  <UFooter class="mt-10">
    <template #left>
      <h2 class="text-2xl">{{ title }}</h2>
      <nav class="mt-4">
        <ul class="space-y-2">
          <li v-for="link in links" :key="link.to">
            <ULink :to="link.to">{{ link.label }}</ULink>
          </li>
        </ul>
      </nav>
    </template>
    <template #right>
      <div class="flex gap-4">
        <UButton
          v-for="button in buttons"
          :key="button.label"
          color="gray"
          :label="button.label"
        />
      </div>
    </template>
  </UFooter>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  links: Array,
  buttons: Array,
})
</script>
