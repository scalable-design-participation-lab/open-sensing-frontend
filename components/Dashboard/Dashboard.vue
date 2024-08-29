<template>
  <div class="dashboard-container">
    <div class="dashboard-grid">
      <UCard class="overview-card">
        <template #header>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Sensor Overview</h2>
            <UBadge color="gray" size="sm">
              Last updated: {{ lastUpdated }}
            </UBadge>
          </div>
        </template>
        <div class="overview-content">
          <p class="text-sm text-gray-600 mb-4">{{ overviewDescription }}</p>
          <div class="flex gap-3 mb-6">
            <UButton color="primary" icon="i-heroicons-download" size="sm">
              Export
            </UButton>
            <UButton color="gray" icon="i-heroicons-share" size="sm">
              Share
            </UButton>
            <UButton color="warning" icon="i-heroicons-pencil" size="sm">
              Edit
            </UButton>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <UCard
              v-for="(stat, index) in overviewStats"
              :key="index"
              class="text-center p-4 bg-white"
            >
              <h3 class="text-2xl font-bold text-blue-500">{{ stat.value }}</h3>
              <p class="text-sm text-gray-600">{{ stat.label }}</p>
            </UCard>
          </div>
        </div>
      </UCard>

      <div class="sensors-container">
        <div class="sensor-grid">
          <SensorTile
            v-for="sensor in sensors"
            :key="sensor.id"
            :sensor="sensor"
            class="sensor-card"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import SensorTile from './SensorTile.vue'

const store = useDashboardUIStore()
const { sensors } = storeToRefs(store)

const overviewDescription = ref(
  'This dashboard provides an overview of all sensor data across the Northeastern University campus.'
)

const lastUpdated = computed(() => {
  const dates = sensors.value.map((sensor) => new Date(sensor.timestamp))
  const latestDate = new Date(Math.max.apply(null, dates))
  return latestDate.toLocaleString()
})

const overviewStats = computed(() => [
  {
    value: sensors.value.filter((sensor) => sensor.status === 'Active').length,
    label: 'Active Sensors',
  },
  {
    value: Object.keys(sensors.value[0]).filter((key) =>
      ['temperature', 'humidity', 'voc', 'nox', 'pm25'].includes(key)
    ).length,
    label: 'Values Measured',
  },
  {
    value: sensors.value.filter((sensor) => sensor.status === 'Maintenance')
      .length,
    label: 'Pending Issues',
  },
])

// Rename the component to address the linter error
defineOptions({
  name: 'DashboardView',
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2.5vh 2.5vw;
  background-color: rgba(240, 242, 245, 0.7);
}

.dashboard-grid {
  width: 90%;
  height: 80vh;
  max-width: 1800px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
}

.overview-card {
  flex-shrink: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.overview-content,
.sensors-container {
  padding: 20px;
}

.sensors-container {
  flex-grow: 1;
  overflow-y: auto;
}

.sensor-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.sensor-card {
  width: 100%;
  height: 100%;
}

@media (max-width: 1400px) {
  .sensor-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .dashboard-container {
    padding: 1.5vh 1.5vw;
  }

  .dashboard-grid {
    width: 95%;
    height: 85vh;
  }

  .sensor-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1vh 1vw;
  }

  .dashboard-grid {
    width: 98%;
    height: 90vh;
  }

  .overview-content,
  .sensors-container {
    padding: 10px;
  }

  .sensor-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .sensor-grid {
    grid-template-columns: 1fr;
  }
}
</style>
