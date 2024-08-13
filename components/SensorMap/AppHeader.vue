<template>
  <header class="header">
    <div class="nav-left">
      <div class="neu-logo block">
        <img
          loading="lazy"
          src="@/assets/images/vector.svg"
          alt="NEU Logo"
          class="neu-logo-image"
        />
      </div>
      <div class="sdpl-icon block">🤲</div>
      <div class="application-name block" @click="handleToggleDashboard">
        Open Sensing
      </div>
    </div>
    <nav class="nav-right">
      <button class="satellite-button block">Satellite</button>
      <button class="more-options-button block" aria-label="More options">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </button>
      <button class="user-profile-button block" aria-label="User profile">
        <el-icon><Download /></el-icon>
      </button>
    </nav>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { Download } from '@element-plus/icons-vue'
import { useDashboardUIStore } from '@/stores/dashboardUI'

const store = useDashboardUIStore()
const { showDashboard } = storeToRefs(store)
const { toggleDashboard } = store

const handleToggleDashboard = () => {
  console.log('AppHeader: Toggle Dashboard clicked')
  toggleDashboard()
  console.log('AppHeader: showDashboard after toggle:', showDashboard.value)
}
</script>

<style scoped>
.header {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.block {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.neu-logo-image {
  width: 45px;
  height: auto;
}

.sdpl-icon {
  font-size: 2rem;
  width: 3.5rem;
  height: 3.5rem;
}

.application-name {
  background-color: #000;
  color: #fff;
  font-weight: 600;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  cursor: pointer;
}

.satellite-button {
  color: #333;
  font-weight: 600;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
}

.more-options-button,
.user-profile-button {
  width: 3.5rem;
  height: 3.5rem;
  border: none;
  cursor: pointer;
}

.dot {
  width: 4px;
  height: 4px;
  background-color: #333;
  border-radius: 50%;
  margin: 0 2px;
}

.block:hover {
  background-color: rgba(255, 255, 255, 1);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

@media (max-width: 1024px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    top: 1rem;
    left: 1rem;
  }

  .nav-right {
    margin-top: 1rem;
  }

  .neu-logo-image {
    width: 100px;
  }

  .sdpl-icon,
  .more-options-button,
  .user-profile-button {
    width: 3rem;
    height: 3rem;
  }

  .application-name,
  .satellite-button {
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
  }
}

@media (max-width: 768px) {
  .header {
    top: 0.75rem;
    left: 0.75rem;
    right: 0.75rem;
  }

  .nav-left,
  .nav-right {
    gap: 0.75rem;
  }

  .neu-logo-image {
    width: 90px;
  }

  .sdpl-icon,
  .more-options-button,
  .user-profile-button {
    width: 2.75rem;
    height: 2.75rem;
  }

  .application-name,
  .satellite-button {
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
  }
}
</style>
