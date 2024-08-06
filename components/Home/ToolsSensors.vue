<template>
  <div class="tools-sensors">
    <button
      v-for="tool in tools"
      :key="tool.name"
      class="tool-button"
      @click="$emit('tool-click', tool.name)"
    >
      <img :src="tool.icon" :alt="tool.name" class="tool-icon" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import homeIcon from '@/assets/images/Home_Page.png'
import filterIcon from '@/assets/images/Funnel.png'
import appIcon from '@/assets/images/Ios_Application_Placeholder.png'
import locationIcon from '@/assets/images/Location.png'

const tools = ref([
  { name: 'home', icon: homeIcon },
  { name: 'filter', icon: filterIcon },
  { name: 'app', icon: appIcon },
  { name: 'location', icon: locationIcon },
])

defineEmits(['tool-click'])
</script>

<style scoped>
.tools-sensors {
  align-items: center;
  background-color: #fafafa;
  border-radius: 50px;
  box-shadow: var(-- drop-shadow);
  display: flex;
  height: 48px;
  justify-content: space-between;
  padding: 5px 45px;
  position: relative;
  transform: rotate (90deg);
  width: 298px;
}

.tool-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  margin: 5px 0;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tool-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.tool-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
