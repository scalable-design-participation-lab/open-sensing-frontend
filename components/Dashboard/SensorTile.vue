<template>
  <el-card class="sensor-tile" shadow="hover">
    <template #header>
      <div class="sensor-header">
        <h3>{{ sensor.location }}</h3>
        <el-tag :type="getStatusType(sensor.status)">
          {{ sensor.status }}
        </el-tag>
        <div class="header-actions">
          <el-button type="text" icon="el-icon-full-screen"></el-button>
          <el-button type="text" @click="openSensorDetail">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </template>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-progress
          type="dashboard"
          :percentage="sensor.batteryLevel"
          :color="getColor(sensor.batteryLevel)"
        >
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage }}%</span>
          </template>
        </el-progress>
        <p class="progress-label">Battery Level</p>
      </el-col>
      <el-col :span="12">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="Temperature">
            {{ sensor.temperature.toFixed(1) }}°C
          </el-descriptions-item>
          <el-descriptions-item label="Humidity">
            {{ sensor.humidity.toFixed(1) }}%
          </el-descriptions-item>
          <el-descriptions-item label="Air Quality">
            {{ sensor.airQuality }}
          </el-descriptions-item>
          <el-descriptions-item label="Soil Moisture">
            {{ sensor.soilMoisture }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { defineProps } from 'vue'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import { ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  sensor: {
    type: Object,
    required: true,
  },
})

const store = useDashboardUIStore()

const getColor = (value) => {
  if (value < 30) return '#F56C6C'
  if (value < 70) return '#E6A23C'
  return '#67C23A'
}

const getStatusType = (status) => {
  switch (status) {
    case 'Active':
      return 'success'
    case 'Inactive':
      return 'danger'
    case 'Maintenance':
      return 'warning'
    default:
      return 'info'
  }
}

const openSensorDetail = () => {
  store.updateSelectedSensor(props.sensor.id)
  store.toggleSensorDetail()
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

.header-actions {
  display: flex;
  align-items: center;
}

.percentage-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.progress-label {
  text-align: center;
  margin-top: 10px;
  color: #606266;
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
