<template>
  <UCheckboxGroup v-model="selectedItems" class="checkbox-group">
    <UCheckbox
      v-for="item in items"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      {{ item.label }}
    </UCheckbox>
  </UCheckboxGroup>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const selectedItems = ref(props.modelValue)

watch(selectedItems, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
