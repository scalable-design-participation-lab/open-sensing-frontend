<!--
 * @file DashboardHeader.vue
 * @description Header component for the dashboard, displaying a title and a badge.
 * @author Dezeng Kong
 * @version 1.0.0
 * @since 7/15/2024
 -->

<template>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-semibold">{{ title }}</h2>
    <UBadge :color="badgeColor" size="sm">
      {{ badgeText }}
    </UBadge>
  </div>
</template>

<script setup lang="ts">
/**
 * Props for the DashboardHeader component
 * @typedef {Object} DashboardHeaderProps
 * @property {string} title - The title to display in the header
 * @property {string} badgeText - The text to display in the badge
 * @property {string} [badgeColor] - The color of the badge (optional)
 */

/**
 * Component props
 * @type {DashboardHeaderProps}
 */
defineProps<{
  title: string
  badgeText: string
  badgeColor?: string
}>()
</script>
