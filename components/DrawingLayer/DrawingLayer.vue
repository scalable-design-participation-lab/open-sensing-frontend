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

      <IconLayer
        :features="pointFeatures"
        :get-icon-for-feature="getIconForPoint"
        :visible-in-subwindow="2"
        @toggle-comment-popup="toggleCommentPopup"
      />
      <PolygonLayer @toggle-comment-popup="toggleCommentPopup" />
      <LineStringLayer @toggle-comment-popup="toggleCommentPopup" />
    </ol-source-vector>
  </ol-vector-layer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'
import IconLayer from './IconLayer.vue'
import PolygonLayer from './PolygonLayer.vue'
import LineStringLayer from './LineStringLayer.vue'

// 导入 SVG 图标
import redIcon from '@/assets/icons/red.svg'
import greenIcon from '@/assets/icons/green.svg'
import blueIcon from '@/assets/icons/blue.svg'
import yellowIcon from '@/assets/icons/yellow.svg'
import purpleIcon from '@/assets/icons/purple.svg'

const props = defineProps({
  projection: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['toggle-comment-popup'])

const mapUIStore = useMapUIStore()

const drawEnable = computed(() => mapUIStore.drawEnable)
const drawType = computed(() => mapUIStore.drawType)
const currentColor = computed(() => mapUIStore.currentColor)

const pointFeatures = computed(() =>
  mapUIStore.features.filter((feature) => feature.type === 'Point')
)

function handleDrawStart(event) {
  mapUIStore.handleDrawStart(event)
}

function handleDrawEnd(event) {
  mapUIStore.handleDrawEnd(event)
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

function toggleCommentPopup(feature) {
  emit('toggle-comment-popup', feature)
}

function getIconForPoint(feature) {
  switch (feature.frequency) {
    case 'every day':
      return redIcon
    case 'every week':
      return greenIcon
    case 'sometimes':
      return blueIcon
    case 'only once':
      return yellowIcon
    case 'never':
      return purpleIcon
    default:
      return redIcon
  }
}
</script>
