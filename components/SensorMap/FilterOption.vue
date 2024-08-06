<template>
  <label class="filter-option">
    <input
      type="checkbox"
      :checked="isChecked"
      @change="$emit('change', $event.target.checked)"
    />
    <span class="option-text">{{ label }}</span>
  </label>
</template>

<script>
export default {
  name: 'FilterOption',
  props: {
    label: {
      type: String,
      required: true,
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],
}
</script>

<style scoped>
.filter-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-text {
  font-size: 13px;
}
</style>
