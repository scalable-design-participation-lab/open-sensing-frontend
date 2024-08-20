<template>
  <section>
    <h2>{{ title }}</h2>
    <UCard v-if="cardContent">
      <component :is="cardContent.type" v-bind="cardContent.props" />
    </UCard>
    <template v-for="(item, index) in content" :key="index">
      <component :is="item.type" v-bind="item.props" />
    </template>
  </section>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

interface ContentItem {
  type: string
  props: any
}

defineProps({
  title: {
    type: String,
    required: true,
  },
  cardContent: {
    type: Object as PropType<ContentItem>,
    default: null,
  },
  content: {
    type: Array as PropType<ContentItem[]>,
    default: () => [],
  },
})
</script>
