">
<template>
  <label class="filter-option">
    <input
      type="checkbox"
      :checked="isChecked"
      @change="emit('change', $event.target.checked)"
    />
    <span class="checkmark"></span>
    <span class="option-text">{{ label }}</span>
  </label>
</template>

<script setup>
import { defineProps, defineEmits, defineOptions } from 'vue'

defineOptions({
  name: 'FilterOption',
})

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['change'])
</script>

<style scoped>
.filter-option {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.filter-option input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 20px;
  width: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.filter-option:hover input ~ .checkmark {
  background-color: #e0e0e0;
}

.filter-option input:checked ~ .checkmark {
  background-color: #2196f3;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.filter-option input:checked ~ .checkmark:after {
  display: block;
}

.filter-option .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.option-text {
  font-size: 14px;
  color: #333;
}
</style>
