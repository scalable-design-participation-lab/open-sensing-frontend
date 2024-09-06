<template>
  <div class="flex flex-col gap-2.5">
    <UCheckbox
      v-for="item in items"
      :key="item.value"
      :label="item.label"
      :model-value="selectedItems[item.value]"
      @update:model-value="updateItem(item.value, $event)"
    >
      {{ item.label }}
    </UCheckbox>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const selectedItems = ref({ ...props.modelValue })

const updateItem = (key, value) => {
  selectedItems.value[key] = value
  emit('update:modelValue', { ...selectedItems.value })
}

watch(
  () => props.modelValue,
  (newValue) => {
    selectedItems.value = { ...newValue }
  },
  { deep: true }
)

onMounted(() => {
  if (Object.keys(selectedItems.value).length === 0 && props.items.length > 0) {
    props.items.forEach((item) => {
      selectedItems.value[item.value] = true
    })
    emit('update:modelValue', { ...selectedItems.value })
  }
})
</script>
