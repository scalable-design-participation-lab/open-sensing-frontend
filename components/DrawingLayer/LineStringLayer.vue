<template>
  <ol-interaction-select
    v-if="enableClick"
    :condition="clickCondition"
    @select="handleSelect"
  >
    <ol-style>
      <ol-style-stroke color="red" :width="3" :line-dash="[6, 6]" />
    </ol-style>
  </ol-interaction-select>

  <ol-vector-layer>
    <ol-source-vector>
      <ol-interaction-draw
        v-if="mapUIStore.drawEnable && mapUIStore.drawType === 'LineString'"
        type="LineString"
        @drawend="mapUIStore.handleDrawEnd"
        @drawstart="mapUIStore.handleDrawStart"
      >
        <ol-style>
          <ol-style-stroke color="red" :width="2" :line-dash="[6, 6]" />
        </ol-style>
      </ol-interaction-draw>

      <ol-feature v-for="feature in lineStringFeatures" :key="feature.id">
        <ol-geom-line-string :coordinates="feature.coordinates" />
        <ol-style>
          <ol-style-stroke color="red" :width="2" :line-dash="[6, 6]" />
        </ol-style>
      </ol-feature>
    </ol-source-vector>
  </ol-vector-layer>

  <ol-overlay
    v-for="feature in lineStringFeatures"
    :key="`start-${feature.id}`"
    :position="getLineStringStartPoint(feature)"
    :offset="[0, 0]"
    :stopEvent="false"
  >
    <div class="prohibit-icon" @click.stop="handleIconClick(feature)">
      <svg
        width="43"
        height="43"
        viewBox="0 0 43 43"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M34.6688 2.58579C33.8877 1.80474 32.6214 1.80474 31.8404 2.58579L21.0299 13.3963L10.5028 2.86919C9.72177 2.08815 8.45544 2.08815 7.67439 2.86919L2.58579 7.9578C1.80474 8.73885 1.80474 10.0052 2.58579 10.7862L13.1129 21.3133L3.00067 31.4255C2.21962 32.2065 2.21962 33.4729 3.00067 34.2539L8.08927 39.3425C8.87032 40.1236 10.1367 40.1236 10.9177 39.3425L21.0299 29.2303L31.4255 39.6259C32.2065 40.407 33.4729 40.407 34.2539 39.6259L39.3425 34.5373C40.1236 33.7563 40.1236 32.4899 39.3425 31.7089L28.9469 21.3133L39.7574 10.5028C40.5384 9.72177 40.5384 8.45544 39.7574 7.67439L34.6688 2.58579Z"
          fill="#E23636"
        />
        <path
          d="M31.8404 2.58579L30.4262 1.17157V1.17157L31.8404 2.58579ZM34.6688 2.58579L36.083 1.17157L36.083 1.17157L34.6688 2.58579ZM21.0299 13.3963L19.6157 14.8105L21.0299 16.2247L22.4441 14.8105L21.0299 13.3963ZM10.5028 2.86919L11.917 1.45498V1.45498L10.5028 2.86919ZM7.67439 2.86919L6.26018 1.45498L6.26018 1.45498L7.67439 2.86919ZM2.58579 7.9578L1.17157 6.54359L1.17157 6.54359L2.58579 7.9578ZM2.58579 10.7862L1.17157 12.2004H1.17157L2.58579 10.7862ZM13.1129 21.3133L14.5271 22.7275L15.9413 21.3133L14.5271 19.8991L13.1129 21.3133ZM3.00067 31.4255L4.41488 32.8397L4.41488 32.8397L3.00067 31.4255ZM3.00067 34.2539L1.58645 35.6681L1.58645 35.6681L3.00067 34.2539ZM8.08927 39.3425L6.67506 40.7567H6.67506L8.08927 39.3425ZM10.9177 39.3425L9.50349 37.9283L9.50348 37.9283L10.9177 39.3425ZM21.0299 29.2303L22.4441 27.8161L21.0299 26.4019L19.6157 27.8161L21.0299 29.2303ZM31.4255 39.6259L30.0113 41.0401L31.4255 39.6259ZM34.2539 39.6259L35.6681 41.0401H35.6681L34.2539 39.6259ZM39.3425 34.5373L40.7567 35.9515V35.9515L39.3425 34.5373ZM39.3425 31.7089L37.9283 33.1231L37.9283 33.1231L39.3425 31.7089ZM28.9469 21.3133L27.5327 19.8991L26.1185 21.3133L27.5327 22.7275L28.9469 21.3133ZM39.7574 10.5028L41.1716 11.917V11.917L39.7574 10.5028ZM39.7574 7.67439L41.1716 6.26018V6.26018L39.7574 7.67439Z"
          fill="black"
        />
      </svg>
    </div>
  </ol-overlay>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'
import { click } from 'ol/events/condition'

const props = defineProps({
  enableClick: {
    type: Boolean,
    default: false,
  },
  isMapPage: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-comment-popup', 'show-comment-display'])

const mapUIStore = useMapUIStore()
const clickCondition = click

const lineStringFeatures = computed(() =>
  mapUIStore.features.filter((feature) => feature.type === 'LineString'),
)

function getLineStringStartPoint(feature) {
  if (feature.coordinates.length > 0) {
    return feature.coordinates[0]
  }
  return [0, 0]
}

function handleSelect(event) {
  const selected = event.selected
  if (selected && selected.length > 0) {
    const olFeature = selected[0]
    const coordinates = olFeature.getGeometry().getCoordinates()

    const feature = lineStringFeatures.value.find((f) => {
      const featureCoords = f.coordinates
      return coordinates.every(
        (coord, index) =>
          Math.abs(coord[0] - featureCoords[index][0]) < 0.0000001 &&
          Math.abs(coord[1] - featureCoords[index][1]) < 0.0000001,
      )
    })

    if (feature) {
      emit('show-comment-display', feature)
    }
  }
}

function handleIconClick(feature) {
  if (props.isMapPage) {
    emit('show-comment-display', feature)
  } else {
    emit('toggle-comment-popup', feature)
  }
}
</script>

<style scoped>
.prohibit-icon {
  cursor: pointer;
  pointer-events: auto;
  z-index: 1;
}
</style>
