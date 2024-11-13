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
        :get-icon-for-feature="getIconForFeature"
        :show-all-plus-icons="showAllPlusIcons"
        :show-comment-icons="showCommentIcons"
        :enable-click="enableClick"
        :is-map-page="isMapPage"
        :show-delete-button="showDeleteButton"
        @toggle-comment-popup="toggleCommentPopup"
        @toggle-image-upload-popup="toggleImageUploadPopup"
        @show-comment-display="handleShowCommentDisplay"
      />

      <PolygonLayer
        :show-all-plus-icons="showAllPlusIcons"
        :show-comment-icons="showCommentIcons"
        :enable-click="enableClick"
        :is-map-page="isMapPage"
        :show-delete-button="showDeleteButton"
        @toggle-comment-popup="toggleCommentPopup"
        @show-comment-display="handleShowCommentDisplay"
      />
      <LineStringLayer
        :show-comment-icons="showCommentIcons"
        :enable-click="enableClick"
        :is-map-page="isMapPage"
        :show-delete-button="showDeleteButton"
        @toggle-comment-popup="toggleCommentPopup"
        @show-comment-display="handleShowCommentDisplay"
      />
    </ol-source-vector>
  </ol-vector-layer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'
import IconLayer from './IconLayer.vue'
import PolygonLayer from './PolygonLayer.vue'
import LineStringLayer from './LineStringLayer.vue'

import redIcon from '@/assets/icons/red.svg'
import greenIcon from '@/assets/icons/green.svg'
import blueIcon from '@/assets/icons/blue.svg'
import yellowIcon from '@/assets/icons/yellow.svg'
import purpleIcon from '@/assets/icons/purple.svg'
import dislikeIcon from '@/assets/icons/dislike.svg'
import heartIcon from '@/assets/icons/heart.svg'
import smileIcon from '@/assets/icons/smile.svg'
import brokenIcon from '@/assets/icons/broken.svg'
import calmIcon from '@/assets/icons/calm.svg'
import lockIcon from '@/assets/icons/lock.svg'
import pollutionIcon from '@/assets/icons/pollution.svg'
import leafIcon from '@/assets/icons/leaf.svg'
import prohibitIcon from '@/assets/icons/prohibit.svg'
import trashIcon from '@/assets/icons/trash.svg'

const props = defineProps({
  projection: {
    type: String,
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
  showCommentIcons: {
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

const drawEnable = computed(() => mapUIStore.drawEnable)
const drawType = computed(() => mapUIStore.drawType)
const currentColor = computed(() => mapUIStore.currentColor)

const pointFeatures = computed(() =>
  mapUIStore.features.filter((feature) => feature.type === 'Point'),
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

function toggleImageUploadPopup(feature) {
  emit('toggle-image-upload-popup', feature)
}

function handleShowCommentDisplay(data) {
  emit('show-comment-display', data)
}

function getIconForFeature(feature) {
  if (feature.isProhibit) {
    return prohibitIcon
  }
  if (feature.iconName) {
    switch (feature.iconName) {
      case 'pollution':
        return pollutionIcon
      case 'leaf':
      case 'flora-fauna':
        return leafIcon
      case 'lock':
      case 'great':
        return lockIcon
      case 'calm':
      case 'safe':
        return calmIcon
      case 'broken':
      case 'unsafe':
        return brokenIcon
      case 'dislike':
      case 'negative':
        return dislikeIcon
      case 'heart':
      case 'love':
        return heartIcon
      case 'smile':
      case 'positive':
        return smileIcon
      case 'trash':
        return trashIcon
      default:
        return getIconForPoint(feature)
    }
  }
  return getIconForPoint(feature)
}

function getIconForPoint(feature) {
  switch (feature.frequency) {
    case 'every day':
    case 'everyday':
      return blueIcon
    case 'every week':
    case 'everyweek':
      return greenIcon
    case 'sometimes':
      return purpleIcon
    case 'only once':
    case 'once':
      return yellowIcon
    case 'never':
      return redIcon
    default:
      return redIcon
  }
}
</script>
