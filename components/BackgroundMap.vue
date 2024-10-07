<template>
  <ol-map
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    style="width: 100%; height: 100vh"
  >
    <ol-view
      ref="view"
      :center="[28.48097, 49.23278]"
      :zoom="12"
      :projection="projection"
    />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <ol-vector-layer>
      <ol-source-vector :projection="projection">
        <ol-interaction-draw
          v-if="drawEnable"
          :type="drawType"
          @drawend="handleDrawEnd"
          @drawstart="handleDrawStart"
        >
          <ol-style>
            <ol-style-stroke :color="currentColor" :width="2" />
            <ol-style-fill :color="[...hexToRgb(currentColor), 0.4]" />
            <ol-style-circle :radius="5">
              <ol-style-fill :color="currentColor" />
              <ol-style-stroke :color="currentColor" :width="2" />
            </ol-style-circle>
          </ol-style>
        </ol-interaction-draw>

        <ol-feature v-for="feature in features" :key="feature.id">
          <ol-geom-point
            v-if="feature.type === 'Point'"
            :coordinates="feature.coordinates"
          />
          <ol-geom-polygon
            v-else-if="feature.type === 'Polygon'"
            :coordinates="feature.coordinates"
          />
          <ol-style>
            <template v-if="feature.type === 'Point'">
              <ol-style-circle :radius="5">
                <ol-style-fill :color="getColor(feature.frequency)" />
                <ol-style-stroke
                  :color="getColor(feature.frequency)"
                  :width="2"
                />
              </ol-style-circle>
            </template>
            <template v-else-if="feature.type === 'Polygon'">
              <ol-style-stroke :color="currentColor" :width="2" />
              <ol-style-fill :color="[...hexToRgb(currentColor), 0.4]" />
            </template>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>
  </ol-map>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'

const mapUIStore = useMapUIStore()

const projection = ref('EPSG:4326')
const drawEnable = computed(() => mapUIStore.drawEnable)
const drawType = computed(() => mapUIStore.drawType)
const currentColor = computed(() => mapUIStore.currentColor)
const features = computed(() => mapUIStore.features)

function handleDrawStart(event) {
  mapUIStore.handleDrawStart(event)
}

function handleDrawEnd(event) {
  mapUIStore.handleDrawEnd(event)
}

function getColor(frequency) {
  return mapUIStore.getColorForFrequency(frequency)
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null
}
</script>
