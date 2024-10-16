<template>
  <div>
    <NavBar />
    <BackgroundMap />
    <GeneralizedFooter :icons="[{ name: '/vector.svg' }, { name: '🤲' }]" />
  </div>
</template>

<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import BackgroundMap from '../components/BackgroundMap.vue'
import GeneralizedFooter from '../components/FrontPage/GeneralizedFooter.vue'
</script>
