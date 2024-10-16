<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import BackgroundMap from '../components/BackgroundMap.vue'
import GeneralizedHeader from '../components/FrontPage/GeneralizedHeader.vue'
import GeneralizedFooter from '../components/FrontPage/GeneralizedFooter.vue'

const leftItems = ref([
  {
    label: 'Drawing Participation',
    variant: 'solid',
    color: 'black',
    onClick: () => toggleDashboard(),
  },
  {
    label: 'Restart Ukraine',
    variant: 'solid',
    color: 'black',
  },
])
</script>

<template>
  <div>
    <NavBar />
    <BackgroundMap />
    <GeneralizedHeader
      class="z-20"
      :left-items="leftItems"
      :right-items="rightItems"
      logo-src="/neu-logo.svg"
      logo-alt="Northeastern University Logo"
      :show-icon="true"
    />
    <GeneralizedFooter />
  </div>
</template>
