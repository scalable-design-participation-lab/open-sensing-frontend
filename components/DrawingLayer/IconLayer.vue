<template>
  <template v-for="feature in features" :key="feature.id">
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
    <ol-overlay :position="feature.coordinates" :offset="[0, 0]">
      <div
        v-if="shouldShowPlusIcon(feature)"
        class="cursor-pointer text-black-500 rounded-full p-0.5 flex justify-center items-center shadow-md"
        @click.stop.prevent="handlePlusIconClick(feature)"
      >
        <img
          src="@/assets/icons/open-icon.svg"
          alt="Open Icon"
          class="w-6 h-6"
        />
      </div>
    </ol-overlay>
  </template>
  <ol-interaction-select :condition="clickCondition" @select="handleSelect" />
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
})

const emit = defineEmits([
  'toggle-comment-popup',
  'toggle-image-upload-popup',
  'show-comment-display',
])

const mapUIStore = useMapUIStore()

const clickCondition = click

function handleSelect(event) {
  const selected = event.selected

  if (selected && selected.length > 0) {
    const olFeature = selected[0]
    const coordinates = olFeature.getGeometry().getCoordinates()

    const feature = props.features.find(
      (f) =>
        Math.abs(f.coordinates[0] - coordinates[0]) < 0.0000001 &&
        Math.abs(f.coordinates[1] - coordinates[1]) < 0.0000001
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
    if (spaceSubwindow === 2 && !feature.iconName) {
      return true
    }
    if (
      belongingSubwindow === 2 &&
      ['heart', 'smile', 'dislike'].includes(feature.iconName)
    ) {
      return true
    }
    if (
      safetySubwindow === 2 &&
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
  emit('toggle-comment-popup', feature)
}
</script>
