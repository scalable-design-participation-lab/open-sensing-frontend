">
<template>
  <button
    class="time-option"
    :class="{ selected: isSelected }"
    @click="emit('select')"
  >
    {{ label }}
  </button>
</template>

<script setup>
import { defineProps, defineEmits, defineOptions } from 'vue'

defineOptions({
  name: 'TimeOption',
})

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select'])
</script>

<style scoped>
.time-option {
  border-radius: 20px;
  padding: 6px 12px;
  min-width: 85px;
  text-align: center;
  font-size: 14px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
  font-weight: 500;
}

.time-option:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.time-option:active {
  transform: translateY(0);
  box-shadow: none;
}

.time-option.selected {
  background-color: #2196f3;
  color: white;
}

.time-option.selected:hover {
  background-color: #1e88e5;
}
</style>
