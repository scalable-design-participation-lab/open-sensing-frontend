<script setup>
import AboutModal from './About.vue'
const store = useDashboardUIStore()
const { showPCoordsToggle } = store

const isDashboardVisible = ref(false)
const isAboutVisible = ref(false)

const navigate = (section) => {
  if (section === 'dashboard') {
    isDashboardVisible.value = true
    isAboutVisible.value = false
  } else if (section === 'about') {
    isDashboardVisible.value = false
    isAboutVisible.value = true
  } else if (section === 'pcoords') {
    showPCoordsToggle()
    isDashboardVisible.value = false
    isAboutVisible.value = false
  }
}

const closeModals = () => {
  isDashboardVisible.value = false
  isAboutVisible.value = false
}
</script>

<template>
  <div
    class="fixed top-0 left-0 white px-5 py-5 w-full h-20 text-black"
    style="background-color: rgba(255, 255, 255, 0.5)"
  >
    <p class="float-left text-4xl font-bold">ECO-HUB SITE ALLOCATION</p>
    <ul class="navigation">
      <li>
        <a
          href="#"
          :class="{ active: isDashboardVisible }"
          @click="navigate('pcoords')"
        >SELECT PROPOSAL</a>
      </li>
      <li>
        <a
          href="#"
          :class="{ active: isDashboardVisible }"
          @click="navigate('dashboard')"
        >DASHBOARD</a>
      </li>
      <li>
        <a
          href="#"
          :class="{ active: isAboutVisible }"
          @click="navigate('about')"
        >ABOUT</a>
      </li>
    </ul>
  </div>

  <SiteAllocationDashboard v-if="isDashboardVisible" @close="closeModals" />
  <AboutModal v-if="isAboutVisible" @close="closeModals" />
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
</style>
