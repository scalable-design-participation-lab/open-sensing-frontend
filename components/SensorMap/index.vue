<template>
  <div class="sensor-map">
    <MapSection class="map-background" />
    <div class="overlay-content">
      <AppHeader class="header" />
      <main class="main-content">
        <FilterSidebar class="sidebar" />
      </main>
      <AppFooter class="footer" />
    </div>
  </div>
</template>

<script>
import AppHeader from './AppHeader.vue'
import MapSection from './MapSection.vue'
import FilterSidebar from './FilterSidebar.vue'
import AppFooter from './AppFooter.vue'

export default {
  name: 'SensorMap',
  components: {
    AppHeader,
    MapSection,
    FilterSidebar,
    AppFooter,
  },
}
</script>

<style scoped>
.sensor-map {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.map-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.overlay-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.header {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
}

.main-content {
  flex-grow: 1;
  display: flex;
  position: relative;
}

.sidebar {
  position: absolute;
  right: 20px;
  top: 100px;
  width: 300px;
  max-height: calc(100% - 40px);
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px; /* 圆角 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 20px;
  z-index: 1000;
  transition: all 0.3s ease;
}

.sidebar:hover {
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.footer {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
}

@media (max-width: 991px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    position: static;
    width: 100%;
  }
}
</style>
