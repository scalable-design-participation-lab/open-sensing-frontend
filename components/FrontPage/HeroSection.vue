<template>
  <ULandingHero :title="title" :description="description" :links="links">
    <template #headline>
      <UButton
        color="gray"
        :to="headlineButton.to"
        :label="headlineButton.label"
        :trailing-icon="headlineButton.icon"
        size="xs"
        class="rounded-full"
      />
    </template>
    <template #default>
      <img
        :src="imageSrc"
        :alt="imageAlt"
        class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
      />
    </template>
  </ULandingHero>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  description: String,
  links: Array,
  headlineButton: Object,
  imageSrc: String,
  imageAlt: String,
})
</script>
