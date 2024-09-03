<template>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold">{{ title }}</h2>
    <UBadge :color="badgeColor" size="sm">
      {{ badgeText }}
    </UBadge>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  badgeText: string
  badgeColor?: string
}>()
</script>
