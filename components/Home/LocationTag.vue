<template>
  <div class="location-tag" @click="$emit('click')">
    <h3 class="location-name">{{ name }}</h3>
    <p class="location-info">{{ info }}</p>
  </div>
</template>

<script setup>
defineProps({
  name: { type: String, default: 'Unknown Location' },
  info: { type: String, default: 'No additional information' },
})

defineEmits(['click'])
</script>

<style scoped>
.location-tag {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 200px;
}

.location-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.location-name {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #333;
}

.location-info {
  font-size: 14px;
  margin: 0;
  color: #666;
}
</style>
