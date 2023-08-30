<script setup>
import { ref } from 'vue'
// import { useCostStore } from '~/store/cost'
// import { storeToRefs } from 'pinia'
</script>

<template>
  <el-collapse>Test</el-collapse>
</template>

<style>
/* Edit el-collapse */
.el-collapse-item__header {
  background-color: rgba(255, 255, 255, 0);
  --el-collapse-content-bg-color: rgba(255, 255, 255, 0);
  border-bottom: 2px solid rgba(0, 0, 0, 0.4);
}

.el-collapse-item__wrap {
  background-color: rgba(255, 255, 255, 0);
  border-bottom: 2px solid rgba(0, 0, 0, 0.4);
}
</style>
