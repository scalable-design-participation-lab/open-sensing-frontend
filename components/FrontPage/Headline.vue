<template>
  <div>
    <h2>{{ title }}</h2>
    <UCard v-if="type === 'diagram'">
      <UTabs :items="content" />
    </UCard>
    <UCard v-else-if="type === 'chart'" class="p-4 text-center">
      <div class="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
        {{ content }}
      </div>
    </UCard>
    <p v-else-if="type === 'paragraph'">{{ content }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  type: {
    type: String,
    validator: (value) => ['diagram', 'chart', 'paragraph'].includes(value),
  },
  content: [Array, String],
})
</script>
