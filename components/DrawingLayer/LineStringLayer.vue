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
    :key="`plus-${feature.id}`"
    :position="getLineStringStartPoint(feature)"
    :offset="[20, 20]"
    :stopEvent="false"
    :positioning="'bottom-right'"
  >
    <div class="plus-icon-container" @click.stop="handleIconClick(feature)">
      <img
        src="@/assets/icons/open-icon.svg"
        alt="Open Icon"
        class="plus-icon"
      />
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

.plus-icon-container {
  cursor: pointer;
  background: white;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  position: relative;
  z-index: 2;
}

.plus-icon {
  width: 24px;
  height: 24px;
}

.plus-icon-container:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
