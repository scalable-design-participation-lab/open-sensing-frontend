<!--
 * DashboardHeader Component
 * 
 * This component represents the header section of the dashboard. It typically
 * includes a title and a badge displaying additional information (e.g., last
 * update time). The header provides context and key information at the top
 * of the dashboard.
 * 
 * @displayName DashboardHeader
 * @usage
 * <DashboardHeader
 *   title="Sensor Dashboard"
 *   badgeText="Last updated: 5 minutes ago"
 *   badgeColor="blue"
 * />
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
