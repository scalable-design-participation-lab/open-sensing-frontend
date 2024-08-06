<template>
  <div class="neu-logo-text">
    <span class="neu">NEU</span>
    <span class="sensor-project">Sensor Project</span>
  </div>
</template>

<script setup>
// No props or emits needed for this component
</script>

<style scoped>
.neu-logo-text {
  display: flex;
  align-items: center;
  font-family: 'Arial', sans-serif;
  background-color: #ffffff;
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.neu {
  font-weight: bold;
  font-size: 24px;
  color: #c41230; /* NEU red color */
  margin-right: 8px;
}

.sensor-project {
  font-size: 18px;
  color: #333;
}
</style>
