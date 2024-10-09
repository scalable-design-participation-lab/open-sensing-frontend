<template>
  <ol-vector-layer>
    <ol-source-vector :projection="projection">
      <ol-interaction-draw
        v-if="drawEnable"
        :type="drawType"
        @drawend="handleDrawEnd"
        @drawstart="handleDrawStart"
      >
        <ol-style>
          <ol-style-stroke
            :color="getDrawColor"
            :width="2"
            :line-dash="drawType === 'LineString' ? [6, 6] : undefined"
          />
          <ol-style-fill :color="[0, 0, 0, 0]" />
          <ol-style-circle :radius="5">
            <ol-style-fill :color="getDrawColor" />
            <ol-style-stroke :color="getDrawColor" :width="1" />
          </ol-style-circle>
        </ol-style>
      </ol-interaction-draw>

      <ol-feature v-for="feature in validFeatures" :key="feature.id">
        <ol-geom-point
          v-if="feature.type === 'Point'"
          :coordinates="feature.coordinates"
        />
        <ol-geom-polygon
          v-else-if="feature.type === 'Polygon'"
          :coordinates="feature.coordinates"
        />
        <ol-geom-line-string
          v-else-if="feature.type === 'LineString'"
          :coordinates="feature.coordinates"
        />
        <ol-style>
          <template v-if="feature.type === 'Point'">
            <ol-style-circle :radius="10">
              <ol-style-fill :color="getColor(feature.frequency)" />
              <ol-style-stroke
                :color="getColor(feature.frequency)"
                :width="2"
              />
            </ol-style-circle>
          </template>
          <template v-else-if="feature.type === 'Polygon'">
            <ol-style-stroke color="black" :width="2" :line-dash="[10, 10]" />
            <ol-style-fill :color="[0, 0, 0, 0]" />
          </template>
          <template v-else-if="feature.type === 'LineString'">
            <ol-style-stroke color="red" :width="2" :line-dash="[6, 6]" />
          </template>
        </ol-style>
      </ol-feature>
    </ol-source-vector>
  </ol-vector-layer>

  <ol-overlay
    v-for="feature in visibleFeatures"
    :key="feature.id"
    :position="getFeatureIconPosition(feature)"
    :offset="[0, 0]"
  >
    <div
      class="cursor-pointer text-black-500 rounded-full p-0.5 flex justify-center items-center shadow-md"
      @click.stop="toggleCommentPopup(feature)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m96 224h-80v80h-32v-80h-80v-32h80v-80h32v80h80Z"
        />
      </svg>
    </div>
  </ol-overlay>

  <ol-overlay
    v-for="feature in lineStringFeatures"
    :key="`start-${feature.id}`"
    :position="getLineStringStartPoint(feature)"
    :offset="[0, 0]"
  >
    <div class="prohibit-icon" @click.stop="toggleCommentPopup(feature)">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="red"
        width="24"
        height="24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
        />
      </svg>
    </div>
  </ol-overlay>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'

const props = defineProps({
  projection: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['toggleCommentPopup'])

const mapUIStore = useMapUIStore()

const drawEnable = computed(() => mapUIStore.drawEnable)
const drawType = computed(() => mapUIStore.drawType)
const currentColor = computed(() => mapUIStore.currentColor)
const features = computed(() => mapUIStore.features)

const validFeatures = computed(() =>
  features.value.filter((feature) => feature && feature.type)
)

const visibleFeatures = computed(() => {
  const currentSubwindow = mapUIStore.currentSubwindow
  if (currentSubwindow === 2) {
    return validFeatures.value.filter((feature) => feature.type === 'Point')
  } else if (currentSubwindow === 3) {
    return validFeatures.value.filter((feature) => feature.type === 'Polygon')
  } else {
    return []
  }
})

const lineStringFeatures = computed(() =>
  validFeatures.value.filter((feature) => feature.type === 'LineString')
)

function getLineStringStartPoint(feature) {
  if (feature.type === 'LineString' && feature.coordinates.length > 0) {
    return feature.coordinates[0]
  }
  return [0, 0] // 默认值，以防坐标不存在
}

function handleDrawStart(event) {
  mapUIStore.handleDrawStart(event)
}

function handleDrawEnd(event) {
  const feature = event.feature
  const geometry = feature.getGeometry()
  const geometryType = geometry.getType()

  if (geometryType === 'LineString') {
    const coordinates = geometry.getCoordinates()
    mapUIStore.addFeature({
      type: 'LineString',
      coordinates: coordinates,
    })
  } else if (geometryType === 'Point') {
    const coordinate = geometry.getCoordinates()
    mapUIStore.addFeature({
      type: 'Point',
      coordinates: coordinate,
      frequency: mapUIStore.currentFrequency,
    })
  } else if (geometryType === 'Polygon') {
    const coordinates = geometry.getCoordinates()
    mapUIStore.addFeature({
      type: 'Polygon',
      coordinates: coordinates,
    })
  }
}

function getColor(frequency) {
  return mapUIStore.getColorForFrequency(frequency) || '#FF0000'
}

function toggleCommentPopup(feature) {
  emit('toggleCommentPopup', feature)
}

function getFeatureIconPosition(feature) {
  if (feature.type === 'Point') {
    return feature.coordinates
  } else if (feature.type === 'Polygon') {
    // 计算多边形的中心点
    const coordinates = feature.coordinates[0] // 取外环坐标
    const sumX = coordinates.reduce((sum, coord) => sum + coord[0], 0)
    const sumY = coordinates.reduce((sum, coord) => sum + coord[1], 0)
    const centerX = sumX / coordinates.length
    const centerY = sumY / coordinates.length
    return [centerX, centerY]
  }
  return [0, 0]
}

const getDrawColor = computed(() => {
  if (drawType.value === 'Point') {
    return currentColor.value
  } else if (drawType.value === 'Polygon') {
    return 'black'
  } else if (drawType.value === 'LineString') {
    return 'red'
  }
  return 'black'
})
</script>

<style scoped>
.prohibit-icon {
  cursor: pointer;
}
</style>
