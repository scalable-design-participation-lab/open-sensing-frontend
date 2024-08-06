<template>
  <section class="map-section">
    <MapDashboard />
    <div class="map-overlay">
      <div class="sensor-tools">
        <el-button
          v-for="(icon, index) in sensorTools"
          :key="index"
          class="sensor-tool-button"
          :class="{ active: activeToolIndex === index }"
          @click="handleToolClick(index)"
        >
          <el-tooltip
            :content="icon.tooltip"
            placement="right"
            :show-after="300"
          >
            <el-icon><component :is="icon.component" /></el-icon>
          </el-tooltip>
        </el-button>
      </div>
      <div class="sensor-markers">
        <SensorInfo
          v-if="selectedSensor"
          :title="selectedSensor.title"
          :time="selectedSensor.time"
          :description="selectedSensor.description"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import {
  House,
  Filter,
  FullScreen,
  LocationInformation,
} from '@element-plus/icons-vue'
import SensorInfo from './SensorInfo.vue'
import MapDashboard from '../MapDashboard/MapDashboard.vue'

export default {
  name: 'MapSection',
  components: {
    SensorInfo,
    MapDashboard,
  },
  setup() {
    const activeToolIndex = ref(null)
    const sensorTools = [
      { component: House, tooltip: 'Home' },
      { component: Filter, tooltip: 'Filter' },
      { component: FullScreen, tooltip: 'Full Screen' },
      { component: LocationInformation, tooltip: 'Location Info' },
    ]

    const handleToolClick = (index) => {
      activeToolIndex.value = activeToolIndex.value === index ? null : index
      console.log(`Clicked tool: ${sensorTools[index].tooltip}`)
    }

    return {
      sensorTools,
      activeToolIndex,
      handleToolClick,
      selectedSensor: {
        title: 'Sensor 1',
        time: '30 minutes ago',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
    }
  },
}
</script>

<style scoped>
.map-section {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.sensor-tools {
  display: flex;
  flex-direction: column;
  width: auto;
  height: auto;
  max-height: 90vh;
  padding: 1.5rem 1rem;
  justify-content: space-between;
  align-items: center;
  border-radius: 2rem;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.9),
    rgba(240, 240, 240, 0.9)
  );
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  transition: all 0.3s ease;
  z-index: 1000;
  pointer-events: auto;
}

.sensor-tools:hover {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 1),
    rgba(245, 245, 245, 1)
  );
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.7) inset;
  transform: translateY(-51%);
}

.sensor-tool-button {
  width: 3.5rem;
  height: 3.5rem;
  margin: 0.5rem 0;
  border: none;
  background-color: transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.sensor-tool-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle,
    rgba(64, 158, 255, 0.1) 0%,
    rgba(64, 158, 255, 0) 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sensor-tool-button:hover::before {
  opacity: 1;
}

.sensor-tool-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.sensor-tool-button.active {
  background-color: #409eff;
  color: white;
  box-shadow: 0 0 15px rgba(64, 158, 255, 0.5);
}

.sensor-tool-button.active:hover {
  transform: translateY(0);
  box-shadow: 0 0 20px rgba(64, 158, 255, 0.7);
}

.sensor-tool-button .el-icon {
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.sensor-tool-button:hover .el-icon {
  transform: scale(1.1);
}

.sensor-markers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}

.sensor-marker {
  position: absolute;
  width: 3rem;
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.sensor-marker:hover {
  transform: scale(1.1);
  background-color: rgba(0, 0, 0, 0.8);
}

.marker-icon {
  width: 1.5rem;
  height: 1.5rem;
  background-color: #fff;
  border-radius: 2px;
}

.sensor-info {
  position: absolute;
  background-color: rgba(250, 250, 250, 0.95);
  border-radius: 10px;
  padding: 1rem;
  width: 250px;
  max-width: 80vw;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .sensor-tools {
    left: 1rem;
    padding: 1rem 0.75rem;
  }

  .sensor-tool-button {
    width: 3rem;
    height: 3rem;
  }

  .sensor-tool-button .el-icon {
    font-size: 1.3rem;
  }
}
</style>
