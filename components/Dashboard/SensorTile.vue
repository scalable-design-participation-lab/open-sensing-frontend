<template>
  <el-card class="sensor-tile" shadow="hover">
    <template #header>
      <div class="sensor-header">
        <h3>{{ sensor.location }}</h3>
        <el-tag :type="getStatusType(sensor.status)">
          {{ sensor.status }}
        </el-tag>
      </div>
    </template>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-progress
          type="dashboard"
          :percentage="sensor.batteryLevel"
          :color="getColor(sensor.batteryLevel)"
        >
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage }}%</span>
            <span class="percentage-label">Battery</span>
          </template>
        </el-progress>
      </el-col>
      <el-col :span="14">
        <div class="sensor-data">
          <div class="data-item">
            <span class="label">Temperature:</span>
            <span class="value">{{ sensor.temperature.toFixed(1) }}°C</span>
          </div>
          <div class="data-item">
            <span class="label">Humidity:</span>
            <span class="value">{{ sensor.humidity.toFixed(1) }}%</span>
          </div>
          <div class="data-item">
            <span class="label">Air Quality:</span>
            <span class="value">{{ sensor.airQuality }}</span>
          </div>
          <div class="data-item">
            <span class="label">Soil Moisture:</span>
            <span class="value">{{ sensor.soilMoisture }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="sensor-actions">
      <el-button type="text" @click="openSensorDetail">
        Details <el-icon class="el-icon--right"><ArrowRight /></el-icon>
      </el-button>
    </div>
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
  margin-bottom: 15px;
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
  display: block;
}

.percentage-label {
  font-size: 14px;
  color: #606266;
}

.sensor-data {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 15px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.data-item {
  margin-bottom: 10px;
}

.data-item:last-child {
  margin-bottom: 0;
}

.data-item .label {
  color: #606266;
  font-size: 0.9em;
  margin-right: 5px;
}

.data-item .value {
  color: #303133;
  font-weight: bold;
}

.sensor-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

:deep(.el-progress) {
  margin: 0 auto;
}

@media (max-width: 1200px) {
  .sensor-header h3 {
    font-size: 1.1em;
  }

  .percentage-value {
    font-size: 22px;
  }

  .data-item {
    font-size: 0.9em;
  }
}

@media (max-width: 768px) {
  .sensor-header h3 {
    font-size: 1em;
  }

  .percentage-value {
    font-size: 20px;
  }

  .data-item {
    font-size: 0.85em;
  }

  .el-row {
    flex-direction: column;
  }

  .el-col {
    width: 100% !important;
  }

  .sensor-data {
    margin-top: 15px;
  }
}
</style>
