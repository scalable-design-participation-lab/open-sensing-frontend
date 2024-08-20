<template>
  <div>
    <h2>References</h2>
    <UAccordion :items="items" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  items: Array,
})
</script>
