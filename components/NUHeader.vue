<!-- <script setup>
const store = useDashboardUIStore()
const { setPopUpVisibility } = store
const { popUpVisibility } = storeToRefs(store)
</script>

<template>
  <div
    class="fixed top-0 left-0 white px-5 py-5 w-full h-20 text-black"
    style="background-color: rgba(255, 255, 255, 0.5)"
  >
    <p class="float-left text-4xl font-bold">ARBORETUM SENSORS</p>
    <ul class="navigation">
      <li>
        <a
          href="#"
          :class="{ active: popUpVisibility.dashboard }"
          @click="setPopUpVisibility('dashboard')"
          >DASHBOARD</a
        >
      </li>
      <li>
        <a
          href="#"
          :class="{ active: popUpVisibility.about }"
          @click="setPopUpVisibility('about')"
          >ABOUT</a
        >
      </li>
    </ul>
  </div>
</template>

<style scoped>
.navigation {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
}

.navigation li {
  margin-left: 20px;
  font-size: 1.2rem;
  font-family: 'Segoe UI Symbol', sans-serif;
}

.navigation li a {
  color: black;
  text-decoration: none;
}

.navigation li a:active,
.navigation li a:hover,
.navigation li a.active {
  color: #609f80;
  font-weight: 900;
}
</style> -->

<script setup>
import { ref, computed } from 'vue'
import { useDashboardUIStore } from '@/stores/dashboardUI'
import {
  Sun,
  Moon,
  LayoutDashboard,
  Info,
  Database,
  Settings,
  LogOut,
} from 'lucide-vue-next'

const store = useDashboardUIStore()
const { setPopUpVisibility } = store
const { popUpVisibility } = storeToRefs(store)

const isDarkMode = ref(false)
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode')
}

const navItems = [
  { name: 'Dashboard', key: 'dashboard', icon: LayoutDashboard },
  { name: 'Data', key: 'data', icon: Database },
  { name: 'Settings', key: 'settings', icon: Settings },
  { name: 'About', key: 'about', icon: Info }, // Changed from InfoCircle to Info
]

const logoColor = computed(() => (isDarkMode.value ? '#FFFFFF' : '#333333'))
const accentColor = computed(() => (isDarkMode.value ? '#4CAF50' : '#2E7D32'))
</script>

<template>
  <header :class="['header', { 'dark-mode': isDarkMode }]">
    <div class="logo-container">
      <svg width="40" height="40" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" :fill="logoColor" />
        <text
          x="50"
          y="50"
          font-size="40"
          :fill="accentColor"
          text-anchor="middle"
          dominant-baseline="central"
        >
          A
        </text>
      </svg>
      <h1 class="logo-text">Arboretum Sensors</h1>
    </div>

    <nav class="navigation">
      <ul>
        <li v-for="item in navItems" :key="item.key">
          <a
            href="#"
            :class="{ active: popUpVisibility[item.key] }"
            @click="setPopUpVisibility(item.key)"
          >
            <component :is="item.icon" class="nav-icon" :size="18" />
            {{ item.name }}
          </a>
        </li>
      </ul>
    </nav>

    <div class="header-controls">
      <button
        class="theme-toggle"
        :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
      >
        <Moon v-if="!isDarkMode" :size="22" />
        <Sun v-else :size="22" />
      </button>
      <button class="logout-button" title="Log out">
        <LogOut :size="22" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 1000;
  font-family: 'Arial', sans-serif;
}

.header.dark-mode {
  background-color: rgba(30, 30, 30, 0.95);
  color: #ffffff;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  margin-left: 1rem;
  color: #333333;
  transition: color 0.3s ease;
  letter-spacing: 0.5px;
  margin-top: 1rem;
}

.dark-mode .logo-text {
  color: #ffffff;
}

.navigation ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navigation li {
  margin: 0 0.5rem;
}

.navigation a {
  color: #333333;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
}

.dark-mode .navigation a {
  color: #ffffff;
}

.navigation a:hover,
.navigation a.active {
  background-color: #4caf50;
  color: #ffffff;
}

.nav-icon {
  margin-right: 0.5rem;
}

.header-controls {
  display: flex;
  align-items: center;
}

.theme-toggle,
.logout-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: 1rem;
  color: #333333;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.dark-mode .theme-toggle,
.dark-mode .logout-button {
  color: #ffffff;
}

.theme-toggle:hover,
.logout-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.dark-mode .theme-toggle:hover,
.dark-mode .logout-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  animation: fadeIn 0.5s ease-out;
}
</style>
