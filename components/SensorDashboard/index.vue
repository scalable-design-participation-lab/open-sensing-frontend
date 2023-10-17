<script setup>
import { ref } from 'vue'

const devNames = ref([
  'HOWARD',
  'BAY VIEW',
  'ASTORIA',
  'WAGNER',
  'FOREST',
  "MARINER'S HARBOR",
])
</script>

<template>
  <div
    class="w-full px-4 bg-[#004E32]"
    :style="{ height: 'calc(100vh - 50px);' }"
  >
    <div class="bg-[#41715C] overflow-x-scroll">
      <h1 class="p-4">Overview</h1>
      <table>
        <tr>
          <td v-for="name in devNames" :key="name" class="pl-4 pb-4">
            <OverviewCard />
          </td>
        </tr>
      </table>
    </div>

    <div class="mt-8 bg-[#41715C] overflow-x-scroll">
      <h1 class="p-4">Temperature</h1>
    </div>
  </div>
</template>

<style>
#pop-up {
  bottom: 1.25rem;
  right: 1.25rem;
  border-radius: 1.5rem;
}
</style>
