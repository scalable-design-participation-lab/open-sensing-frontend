<template>
  <button class="button-help" @click="$emit('click')">
    <span class="icon">?</span>
  </button>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.button-help {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #ffffff;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button-help:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.icon {
  font-size: 24px;
  color: #4a4a4a;
  font-weight: bold;
}
</style>
