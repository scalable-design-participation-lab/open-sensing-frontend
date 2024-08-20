<template>
  <section>
    <h2 class="text-2xl font-medium text-black dark:text-white mb-5">
      More in this series
    </h2>
    <ULandingGrid :cols="cols" :gap="5">
      <ULandingCard
        v-for="(item, index) in items"
        :key="index"
        :title="item.title"
        :description="item.description"
        :icon="item.icon"
        class="col-span-6 row-span-2"
      />
    </ULandingGrid>
  </section>
</template>

<script setup lang="ts">
defineProps({
  items: Array,
  cols: {
    type: Number,
    default: 3,
  },
})
</script>
