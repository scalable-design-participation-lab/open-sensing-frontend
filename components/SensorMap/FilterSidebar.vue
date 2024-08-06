<template>
  <aside class="filter-sidebar">
    <div class="filter-header">
      <button
        class="collapse-button"
        aria-label="Collapse filters"
        @click="toggleCollapse"
      >
        <el-icon><Right /></el-icon>
      </button>
      <h2 class="filter-title">Filter</h2>
    </div>
    <div class="filter-divider"></div>
    <div v-if="!isCollapsed" class="filter-content">
      <div class="filter-section">
        <h3 class="filter-section-title">Location</h3>
        <div class="filter-options">
          <FilterOption
            v-for="(location, index) in locations"
            :key="index"
            :label="location"
            :is-checked="selectedLocations.includes(location)"
            @change="toggleLocation(location)"
          />
        </div>
      </div>
      <div class="filter-section">
        <h3 class="filter-section-title">Data</h3>
        <div class="filter-options">
          <FilterOption
            v-for="(dataType, index) in dataTypes"
            :key="index"
            :label="dataType"
            :is-checked="selectedDataTypes.includes(dataType)"
            @change="toggleDataType(dataType)"
          />
        </div>
      </div>
      <div class="filter-section">
        <h3 class="filter-section-title">Status</h3>
        <div class="filter-options">
          <FilterOption
            v-for="(status, index) in statuses"
            :key="index"
            :label="status"
            :is-checked="selectedStatuses.includes(status)"
            @change="toggleStatus(status)"
          />
        </div>
      </div>
      <div class="filter-section">
        <h3 class="filter-section-title">Time</h3>
        <div class="time-range">
          <div class="time-input">
            <el-icon><Calendar /></el-icon>
            <span>from</span>
          </div>
          <span class="time-separator">
            <el-icon><Right /></el-icon>
          </span>
          <div class="time-input">
            <el-icon><Calendar /></el-icon>
            <span>to</span>
          </div>
        </div>
        <div class="time-options">
          <TimeOption
            v-for="(option, index) in timeOptions"
            :key="index"
            :label="option"
            @select="selectTimeOption(option)"
          />
        </div>
      </div>
    </div>
  </aside>
</template>
<script>
import FilterOption from './FilterOption.vue'
import TimeOption from './TimeOption.vue'
import { Calendar, Right } from '@element-plus/icons-vue'

export default {
  name: 'FilterSidebar',
  components: {
    FilterOption,
    TimeOption,
    Calendar,
    Right,
  },
  data() {
    return {
      isCollapsed: false,
      locations: [
        'Architecture Studios',
        'Cabot Center',
        'Cargill Hall',
        'Carter Playground',
        'Centennial Common',
        'Columbus Garage',
        'Curry Student Center',
        'Forsyth Building',
        'Gainsborough Garage',
        'Gainsborough Garage Roof',
        'ISEC Terrace',
        'Metthews Arena',
        'Robinson Hall',
        'Snell Library Quad',
      ],
      dataTypes: ['Temperature', 'Humidity', 'Air Pollution'],
      statuses: ['Active', 'Inactive', 'Conflict'],
      timeOptions: [
        'today',
        'last 24h',
        'last 7 days',
        'last 14 days',
        'last 30 days',
        'last 365 days',
      ],
      selectedLocations: [],
      selectedDataTypes: [],
      selectedStatuses: [],
      selectedTimeOption: null,
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    },
    toggleLocation(location) {
      const index = this.selectedLocations.indexOf(location)
      if (index === -1) {
        this.selectedLocations.push(location)
      } else {
        this.selectedLocations.splice(index, 1)
      }
    },
    toggleDataType(dataType) {
      const index = this.selectedDataTypes.indexOf(dataType)
      if (index === -1) {
        this.selectedDataTypes.push(dataType)
      } else {
        this.selectedDataTypes.splice(index, 1)
      }
    },
    toggleStatus(status) {
      const index = this.selectedStatuses.indexOf(status)
      if (index === -1) {
        this.selectedStatuses.push(status)
      } else {
        this.selectedStatuses.splice(index, 1)
      }
    },
    selectTimeOption(option) {
      this.selectedTimeOption = option
    },
  },
}
</script>

<style scoped>
.filter-sidebar {
  width: 24%;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.collapse-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.collapse-button:hover {
  background-color: #e0e0e0;
}

.filter-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.filter-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 16px 0;
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filter-section-title {
  font-size: 16px;
  font-weight: 500;
  color: #555;
  margin-bottom: 12px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.time-input {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f5f5f5;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.time-input:hover {
  background-color: #e8e8e8;
}

.time-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 991px) {
  .filter-sidebar {
    width: 100%;
    margin-top: 40px;
  }
}
</style>
