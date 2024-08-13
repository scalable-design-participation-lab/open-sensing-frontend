<!-- SensorTile.vue -->
<template>
  <el-card class="sensor-tile" shadow="hover">
    <template #header>
      <div class="sensor-header">
        <h3>Sensor {{ sensor.id }}</h3>
        <span>{{ sensor.location }}</span>
        <el-button type="text" icon="el-icon-full-screen"></el-button>
      </div>
    </template>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-progress
          type="dashboard"
          :percentage="sensor.value"
          :color="getColor(sensor.value)"
        >
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage }}</span>
          </template>
        </el-progress>
      </el-col>
      <el-col :span="12">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="Air quality">
            {{ sensor.airQuality }}
          </el-descriptions-item>
          <el-descriptions-item label="Soil Moisture">
            {{ sensor.soilMoisture }}
          </el-descriptions-item>
          <el-descriptions-item label="Temperature">
            {{ sensor.temperature }}
          </el-descriptions-item>
          <el-descriptions-item label="Battery">
            {{ sensor.battery }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  sensor: {
    type: Object,
    required: true,
  },
})

const getColor = (value) => {
  if (value < 30) return '#F56C6C'
  if (value < 70) return '#E6A23C'
  return '#67C23A'
}
</script>

<style scoped>
.sensor-tile {
  height: 100%;
  margin-bottom: 0;
}

.sensor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sensor-header h3 {
  margin: 0;
  font-size: 1.2em;
  color: #303133;
}

.percentage-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.el-progress {
  margin: 0 auto;
}

.el-descriptions {
  font-size: 0.9em;
}

:deep(.el-descriptions__label) {
  color: #606266;
}

:deep(.el-descriptions__content) {
  color: #303133;
}
</style>
