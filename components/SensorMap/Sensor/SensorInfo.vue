">
<template>
  <div class="sensor-info">
    <div class="info-header">
      <span>
        <el-icon><ArrowLeftBold /></el-icon>
        <el-icon><ArrowRightBold /></el-icon>
      </span>
      <span class="arrow-icon">
        <el-icon><TopRight /></el-icon>
      </span>
    </div>
    <div class="info-divider"></div>
    <div class="info-content">
      <h3 class="sensor-title">{{ title }}</h3>
      <span class="sensor-time">{{ time }}</span>
    </div>
    <p class="sensor-description">{{ description }}</p>
  </div>
</template>

<script setup>
import { defineProps, defineOptions } from 'vue'
import {
  ArrowLeftBold,
  ArrowRightBold,
  TopRight,
} from '@element-plus/icons-vue'

defineOptions({
  name: 'SensorInfo',
})

defineProps({
  title: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.sensor-info {
  position: absolute;
  background-color: #fafafa;
  border-radius: 5px;
  padding: 13px;
  width: 227px;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.info-header {
  display: flex;
  justify-content: space-between;
}

.info-divider {
  height: 1px;
  background-color: #000;
  margin: 9px 0;
}

.sensor-title {
  font-size: 13px;
  font-weight: 500;
}

.sensor-time {
  font-size: 11px;
  color: #a8a8a8;
}

.sensor-description {
  font-size: 11px;
  margin-top: 12px;
}
</style>
