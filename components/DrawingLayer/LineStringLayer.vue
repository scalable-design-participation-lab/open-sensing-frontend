<template>
  <ol-vector-layer>
    <ol-source-vector>
      <ol-feature v-for="feature in lineStringFeatures" :key="feature.id">
        <ol-geom-line-string :coordinates="feature.coordinates" />
        <ol-style>
          <ol-style-stroke color="red" :width="2" :line-dash="[6, 6]" />
        </ol-style>
      </ol-feature>
    </ol-source-vector>
  </ol-vector-layer>

  <ol-interaction-select
    v-if="enableClick"
    :condition="clickCondition"
    @select="handleSelect"
  >
    <ol-style>
      <ol-style-stroke color="red" :width="2" :line-dash="[6, 6]" />
    </ol-style>
  </ol-interaction-select>

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
      </svg>
    </div>
  </ol-overlay>

  <ol-overlay
    v-for="feature in lineStringFeatures"
    :key="`delete-${feature.id}`"
    :position="getLineStringEndPoint(feature)"
    :offset="[20, -20]"
    :stopEvent="false"
    :positioning="'top-right'"
  >
    <div class="delete-icon-container" @click.stop="handleDeleteClick(feature)">
      <img
        src="@/assets/icons/delete.svg"
        alt="Delete Icon"
        class="delete-icon-img"
      />
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

function getLineStringEndPoint(feature) {
  if (feature.coordinates.length > 0) {
    return feature.coordinates[feature.coordinates.length - 1]
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

function handleDeleteClick(feature) {
  if (confirm('Are you sure you want to delete this line?')) {
    mapUIStore.deleteFeature(feature.id)
  }
}
</script>

<style scoped>
.prohibit-icon {
  cursor: pointer;
  pointer-events: auto;
  z-index: 1;
}

.delete-icon-container {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  position: relative;
  z-index: 2;
}

.delete-icon-img {
  width: 24px;
  height: 24px;
  transition: transform 0.2s ease;
}

.delete-icon-container:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
