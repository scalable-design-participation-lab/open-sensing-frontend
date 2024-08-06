<template>
  <button class="time-option" @click="$emit('select')">{{ label }}</button>
</template>

<script>
export default {
  name: 'TimeOption',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  emits: ['select'],
}
</script>

<style scoped>
.time-option {
  border-radius: 5px;
  padding: 3px 0;
  width: 85px;
  text-align: center;
  font-size: 13px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
}

.time-option:hover {
  background-color: #e0e0e0;
}
</style>
