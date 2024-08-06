<template>
  <div class="sensor-marker" :style="{ top: top, left: left }">
    <div class="marker-icon"></div>
  </div>
</template>

<script>
export default {
  name: 'SensorMarker',

  props: {
    top: {
      type: String,
      required: true,
    },
    left: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.sensor-marker {
  position: absolute;
  width: 68px;
  height: 68px;
  background-color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-icon {
  width: 35px;
  height: 35px;
  background-color: #000;
  border-radius: 1px;
}
</style>
