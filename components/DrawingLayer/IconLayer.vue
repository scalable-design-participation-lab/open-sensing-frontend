<template>
  <template v-for="feature in features" :key="feature.id">
    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature>
          <ol-geom-point :coordinates="feature.coordinates" />
          <ol-style>
            <ol-style-icon
              :src="getIconForFeature(feature)"
              :scale="1"
              :anchor="[0.5, 0.5]"
            />
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>

    <ol-interaction-select
      v-if="enableClick"
      :condition="clickCondition"
      @select="(event) => handleSelect(event, feature)"
    >
      <ol-style>
        <ol-style-icon
          :src="getIconForFeature(feature)"
          :scale="1"
          :anchor="[0.5, 0.5]"
        />
      </ol-style>
    </ol-interaction-select>

    <ol-overlay
      :position="feature.coordinates"
      :offset="[0, 0]"
      :stopEvent="false"
      :positioning="'top-left'"
    >
      <div
        v-if="shouldShowPlusIcon(feature)"
        class="plus-icon-container"
        @click.stop.prevent="handlePlusIconClick(feature)"
      >
        <img
          src="@/assets/icons/open-icon.svg"
          alt="Open Icon"
          class="plus-icon"
        />
      </div>
    </ol-overlay>

    <ol-overlay
      v-if="showDeleteButton"
      :position="feature.coordinates"
      :offset="[-30, -30]"
      :stopEvent="false"
      :positioning="'top-left'"
    >
      <div
        class="delete-icon-container"
        @click.stop.prevent="handleDeleteClick(feature)"
      >
        <img
          src="@/assets/icons/delete.svg"
          alt="Delete Icon"
          class="delete-icon"
        />
      </div>
    </ol-overlay>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'
import { click } from 'ol/events/condition'

const props = defineProps({
  features: {
    type: Array,
    required: true,
  },
  getIconForFeature: {
    type: Function,
    required: true,
  },
  showAllPlusIcons: {
    type: Boolean,
    default: undefined,
  },
  enableClick: {
    type: Boolean,
    default: false,
  },
  isMapPage: {
    type: Boolean,
    default: false,
  },
  showDeleteButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'toggle-comment-popup',
  'toggle-image-upload-popup',
  'show-comment-display',
])

const mapUIStore = useMapUIStore()

const clickCondition = click

function handleSelect(event, feature) {
  const selected = event.selected
  if (selected && selected.length > 0) {
    const olFeature = selected[0]
    const coordinates = olFeature.getGeometry().getCoordinates()

    const feature = props.features.find(
      (f) =>
        Math.abs(f.coordinates[0] - coordinates[0]) < 0.0000001 &&
        Math.abs(f.coordinates[1] - coordinates[1]) < 0.0000001,
    )

    if (feature) {
      emit('show-comment-display', feature)
    }
  }
}

function shouldShowPlusIcon(feature) {
  if (props.showAllPlusIcons === false) {
    return false
  }

  if (props.showAllPlusIcons === true) {
    return true
  }

  const spaceSubwindow = mapUIStore.spaceSubwindow
  const belongingSubwindow = mapUIStore.belongingSubwindow
  const safetySubwindow = mapUIStore.safetySubwindow
  const environmentSubwindow = mapUIStore.environmentSubwindow

  if (feature.type === 'Point') {
    if (spaceSubwindow === 1 && !feature.iconName) {
      return true
    }
    if (
      belongingSubwindow === 1 &&
      ['heart', 'smile', 'dislike'].includes(feature.iconName)
    ) {
      return true
    }
    if (
      safetySubwindow === 1 &&
      ['broken', 'calm', 'lock'].includes(feature.iconName)
    ) {
      return true
    }
    if (environmentSubwindow === 1 && feature.iconName === 'pollution') {
      return true
    }
    if (environmentSubwindow === 2 && feature.iconName === 'leaf') {
      return true
    }
  }
  return false
}

function handlePlusIconClick(feature) {
  // Toggle comment popup for space features (frequency-based points)
  if (!feature.iconName) {
    emit('toggle-comment-popup', feature)
  }
  // Toggle image upload popup for themed icons (belonging, safety, environment)
  else {
    emit('toggle-image-upload-popup', feature)
  }
}

function handleDeleteClick(feature) {
  // Add confirmation dialog
  if (confirm('Are you sure you want to delete this point?')) {
    mapUIStore.deleteFeature(feature.id)
  }
}
</script>

<style scoped>
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
}

.plus-icon {
  width: 24px;
  height: 24px;
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

.delete-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.2s ease;
}

.delete-icon-container:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
