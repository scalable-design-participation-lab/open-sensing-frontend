<template>
  <ol-map
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    style="width: 100%; height: 100vh"
    @click="handleMapClick"
  >
    <ol-view
      ref="view"
      :center="[28.48097, 49.23278]"
      :zoom="18"
      :projection="projection"
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
      @toggle-comment-popup="toggleCommentPopup"
    />

    <ol-overlay
      v-if="commentPopupVisible"
      :position="commentPopupPosition"
      :offset="[30, 20]"
    >
      <CommentPopup
        :is-visible="commentPopupVisible"
        :feature-id="selectedFeatureId"
        class="z-50"
        @close="closeCommentPopup"
      />
    </ol-overlay>
  </ol-map>

  <CommentPopup
    :is-visible="commentPopupVisible"
    :feature-id="selectedFeatureId"
    @close="closeCommentPopup"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'
import { useRuntimeConfig } from '#app'

const mapUIStore = useMapUIStore()
const config = useRuntimeConfig()

const projection = ref('EPSG:4326')
const commentPopupVisible = ref(false)
const selectedFeatureId = ref(null)
const commentPopupPosition = ref(null)

const mapboxStyle = 'cesandoval09/clxkxw58f01tt01qj2ep8g1qr'
const mapboxToken = config.public.MAPBOX_ACCESS_TOKEN
const mapboxUrl = computed(
  () =>
    `https://api.mapbox.com/styles/v1/${mapboxStyle}/tiles/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2VzYW5kb3ZhbDA5IiwiYSI6ImNsdHl3OXI0eTBoamkya3MzamprbmlsMTUifQ.bIy013nDKsteOtWQRZMjqw`
)
const mapboxAttribution =
  '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

function toggleCommentPopup(feature) {
  if (commentPopupVisible.value && selectedFeatureId.value === feature.id) {
    closeCommentPopup()
  } else {
    openCommentPopup(feature)
  }
}

function openCommentPopup(feature) {
  selectedFeatureId.value = feature.id
  commentPopupVisible.value = true
  if (feature.type === 'Point') {
    commentPopupPosition.value = feature.coordinates
  } else if (feature.type === 'Polygon') {
    const coordinates = feature.coordinates[0] // 取外环坐标
    const sumX = coordinates.reduce((sum, coord) => sum + coord[0], 0)
    const sumY = coordinates.reduce((sum, coord) => sum + coord[1], 0)
    const centerX = sumX / coordinates.length
    const centerY = sumY / coordinates.length
    commentPopupPosition.value = [centerX, centerY]
  } else {
    commentPopupPosition.value = feature.coordinates[0]
  }
}

function closeCommentPopup() {
  commentPopupVisible.value = false
  selectedFeatureId.value = null
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
</script>
