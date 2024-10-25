<template>
  <ol-map
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    style="width: 100%; height: 100vh"
    @click="handleMapClick"
  >
    <ol-view
      ref="view"
      :center="[28.476908, 49.249253]"
      :zoom="17.68"
      :projection="projection"
      :rotation="0"
    />

    <ol-tile-layer>
      <ol-source-xyz
        :url="mapboxUrl"
        :attributions="mapboxAttribution"
        :max-zoom="19"
        :tile-size="512"
        :tile-pixel-ratio="2"
      />
    </ol-tile-layer>

    <DrawingLayer
      :projection="projection"
      :show-all-plus-icons="showAllPlusIcons"
      :enable-click="isMapPage"
      :is-map-page="isMapPage"
      @toggle-comment-popup="toggleCommentPopup"
      @toggle-image-upload-popup="toggleImageUploadPopup"
      @show-comment-display="handleShowCommentDisplay"
    />

    <ol-overlay
      v-if="commentPopupVisible"
      :position="commentPopupPosition"
      :offset="[30, 20]"
    >
      <CommentPopup
        :is-visible="commentPopupVisible"
        :feature-id="selectedFeatureId"
        class="z-10"
        @close="closeCommentPopup"
      />
    </ol-overlay>

    <ol-overlay
      v-if="imageUploadPopupVisible"
      :position="imageUploadPopupPosition"
      :offset="[30, 20]"
    >
      <ImageUploadPopup
        :is-visible="imageUploadPopupVisible"
        :feature-id="selectedFeatureId"
        class="z-30"
        @close="closeImageUploadPopup"
        @upload="handleImageUpload"
      />
    </ol-overlay>

    <!-- Add route check for CommentDisplay -->
    <CommentDisplay
      v-if="isMapPage"
      v-model="showCommentDisplay"
      :feature="selectedFeatureForDisplay"
    />
  </ol-map>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, watch } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'
import { useRuntimeConfig } from '#app'
import { useRoute } from 'vue-router'
import DrawingLayer from './DrawingLayer/DrawingLayer.vue'
import CommentPopup from './CommentPopup.vue'
import ImageUploadPopup from './ImageUploadPopup.vue'
import CommentDisplay from './CommentDisplay.vue'

const props = defineProps({
  showAllPlusIcons: {
    type: Boolean,
    default: undefined,
  },
})

const mapUIStore = useMapUIStore()
const config = useRuntimeConfig()
const route = useRoute()

const projection = ref('EPSG:4326')
const commentPopupVisible = ref(false)
const imageUploadPopupVisible = ref(false)
const selectedFeatureId = ref(null)
const commentPopupPosition = ref(null)
const imageUploadPopupPosition = ref(null)
const showCommentDisplay = ref(false)
const selectedFeatureForDisplay = ref(null)

const mapboxStyle = 'cesandoval09/clxkxw58f01tt01qj2ep8g1qr'
const mapboxToken = config.public.MAPBOX_ACCESS_TOKEN
const mapboxUrl = computed(
  () =>
    `https://api.mapbox.com/styles/v1/${mapboxStyle}/tiles/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2VzYW5kb3ZhbDA5IiwiYSI6ImNsdHl3OXI0eTBoamkya3MzamprbmlsMTUifQ.bIy013nDKsteOtWQRZMjqw`
)
const mapboxAttribution =
  '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

const isMapPage = computed(() => route.name === 'map')

function toggleCommentPopup(feature) {
  if (commentPopupVisible.value && selectedFeatureId.value === feature.id) {
    closeCommentPopup()
  } else {
    openCommentPopup(feature)
  }
}

function toggleImageUploadPopup(feature) {
  if (imageUploadPopupVisible.value && selectedFeatureId.value === feature.id) {
    closeImageUploadPopup()
  } else {
    openImageUploadPopup(feature)
  }
}

function openCommentPopup(feature) {
  selectedFeatureId.value = feature.id
  commentPopupVisible.value = true
  imageUploadPopupVisible.value = false
  commentPopupPosition.value = getFeaturePosition(feature)
}

function openImageUploadPopup(feature) {
  selectedFeatureId.value = feature.id
  imageUploadPopupVisible.value = true
  commentPopupVisible.value = false
  imageUploadPopupPosition.value = getFeaturePosition(feature)
}

function getFeaturePosition(feature) {
  if (feature.type === 'Point') {
    return feature.coordinates
  } else if (feature.type === 'Polygon') {
    const coordinates = feature.coordinates[0]
    const sumX = coordinates.reduce((sum, coord) => sum + coord[0], 0)
    const sumY = coordinates.reduce((sum, coord) => sum + coord[1], 0)
    return [sumX / coordinates.length, sumY / coordinates.length]
  } else {
    return feature.coordinates[0]
  }
}

function closeCommentPopup() {
  commentPopupVisible.value = false
  selectedFeatureId.value = null
}

function closeImageUploadPopup() {
  imageUploadPopupVisible.value = false
  selectedFeatureId.value = null
}

function handleImageUpload(images) {
  mapUIStore.updateFeatureImages(selectedFeatureId.value, images)
  closeImageUploadPopup()
}

function handleMapClick(event) {
  if (mapUIStore.drawEnable && mapUIStore.drawType === 'Point') {
    const coordinate = event.coordinate
    mapUIStore.addFeature({
      type: 'Point',
      coordinates: coordinate,
      frequency: mapUIStore.currentFrequency,
    })
  }
}

const emit = defineEmits(['show-comment-display'])

function handleShowCommentDisplay(feature) {
  if (!isMapPage.value) return

  closeCommentPopup()
  closeImageUploadPopup()

  selectedFeatureForDisplay.value = feature
  showCommentDisplay.value = true
}

// Add watchers for debugging
// watch(showCommentDisplay, (newVal) => {})
// watch(selectedFeatureForDisplay, (newVal) => {})
</script>
