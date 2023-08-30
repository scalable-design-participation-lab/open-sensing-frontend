<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref } from 'vue'
</script>

<template>
  <main class="font-sans font-normal flex flex-col h-screen">
    <header><LocalCodeHeader /></header>

    <section class="design-widgets">
      <DesignSite
        :location="`Owen's Street - Mission Bay`"
        class="overflow-y-scroll"
      />
    </section>

    <!-- This section is the floating bit that changes the site design with sliders -->
    <section>
      <div class="sliders absolute bg-white/90 rounded-lg w-1/2 py-6">
        <div class="px-10">
          <p class="font-bold text-xl mb-4">Design the site</p>
          <div class="stuff">
            <el-slider
              v-model="stuff"
              :show-tooltip="false"
              :size="large"
              :step="20"
              show-stops
            />
            <span class="float-left">LESS STUFF</span>
            <span class="float-right">MORE STUFF</span>
          </div>

          <div class="landscape">
            <el-slider
              v-model="landscape"
              :show-tooltip="false"
              :size="large"
              :step="20"
              show-stops
            />
            <span class="float-left">LESS INTERVENTION</span>
            <span class="float-right">MORE INTERVENTION</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ThreeJS Canvas -->
    <section>
      <ThreeJS-mat />
    </section>
    <!-- <footer
      class="py-14 flex flex-col sm:flex-row justify-between items-start gap-2 leading-tight"
    ></footer> -->
  </main>
</template>

<style>
html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
body {
  background-color: #fffdf8;
}

.sliders {
  right: 0px;
  bottom: 0px;
  width: calc(83.33% - 80px);
  margin: 0px 40px 24px 40px;
}

.el-slider {
  --el-slider-main-bg-color: #004700;
  --el-slider-runway-bg-color: rgba(0, 0, 0, 0.3);
  --el-slider-stop-bg-color: #84ff0e;
  --el-slider-disabled-color: var(--el-text-color-placeholder);
  --el-slider-button-size: 18px;
}
</style>
