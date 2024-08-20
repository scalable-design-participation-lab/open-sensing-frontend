<template>
  <p :class="className">{{ content }}</p>
</template>

<script setup lang="ts">
defineProps({
  content: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: '',
  },
})
</script>
