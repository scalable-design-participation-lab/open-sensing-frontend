<template>
  <section>
    <h2>{{ title }}</h2>
    <UCard v-if="cardContent">
      <component :is="cardContent.type" v-bind="cardContent.props" />
    </UCard>
    <p v-if="content">{{ content }}</p>
  </section>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  content: String,
  cardContent: Object,
})
</script>
