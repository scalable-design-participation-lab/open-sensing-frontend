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
      :zoom="12"
      :projection="projection"
    />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

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
              :color="currentColor"
              :width="2"
              :line-dash="[6, 6]"
            />
            <ol-style-fill :color="[0, 0, 0, 0]" />
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
              <ol-style-stroke
                :color="currentColor"
                :width="2"
                :line-dash="[6, 6]"
              />
              <ol-style-fill :color="[0, 0, 0, 0]" />
            </template>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>

    <ol-overlay
      v-for="feature in allFeatures"
      :key="feature.id"
      :position="getFeatureIconPosition(feature)"
      :offset="[0, 0]"
    >
      <div
        v-if="mapUIStore.currentSubwindow >= 2"
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'
import CommentPopup from '@/components/CommentPopup.vue'

const mapUIStore = useMapUIStore()

const projection = ref('EPSG:4326')
const drawEnable = computed(() => mapUIStore.drawEnable)
const drawType = computed(() => mapUIStore.drawType)
const currentColor = computed(() => mapUIStore.currentColor)
const features = computed(() => mapUIStore.features)

const validFeatures = computed(() =>
  features.value.filter((feature) => feature && feature.type)
)

const allFeatures = computed(() => validFeatures.value)

const commentPopupVisible = ref(false)
const selectedFeatureId = ref(null)
const commentPopupPosition = ref(null)

function handleDrawStart(event) {
  mapUIStore.handleDrawStart(event)
}

function handleDrawEnd(event) {
  const feature = event.feature
  feature.set('frequency', mapUIStore.currentFrequency)
  mapUIStore.handleDrawEnd(event)
  console.log('New feature:', feature.getProperties())

  if (feature.getGeometry().getType() === 'Polygon') {
    const coordinates = feature.getGeometry().getCoordinates()
    const lastPoint = coordinates[0][coordinates[0].length - 1]
    openCommentPopup(
      {
        id: Date.now(),
        type: 'Polygon',
        coordinates: coordinates,
      },
      lastPoint
    )
  }
}

function getColor(frequency) {
  const color = mapUIStore.getColorForFrequency(frequency)
  console.log('Color for frequency:', frequency, 'is:', color)
  return color || '#FF0000'
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null
}

function toggleCommentPopup(feature) {
  if (commentPopupVisible.value && selectedFeatureId.value === feature.id) {
    closeCommentPopup()
  } else {
    openCommentPopup(feature)
  }
}

function openCommentPopup(feature) {
  console.log('openCommentPopup called with feature:', feature)
  selectedFeatureId.value = feature.id
  commentPopupVisible.value = true
  commentPopupPosition.value = getFeatureIconPosition(feature)
  console.log('commentPopupVisible set to:', commentPopupVisible.value)
  console.log('selectedFeatureId set to:', selectedFeatureId.value)
  console.log('commentPopupPosition set to:', commentPopupPosition.value)
}

function closeCommentPopup() {
  console.log('closeCommentPopup called')
  commentPopupVisible.value = false
  selectedFeatureId.value = null
  console.log('commentPopupVisible set to:', commentPopupVisible.value)
  console.log('selectedFeatureId set to:', selectedFeatureId.value)
}

function handleMapClick(event) {
  if (drawEnable.value && drawType.value === 'Point') {
    const coordinate = event.coordinate
    mapUIStore.addFeature({
      type: 'Point',
      coordinates: coordinate,
      frequency: mapUIStore.currentFrequency,
    })
    openCommentPopup(mapUIStore.features[mapUIStore.features.length - 1])
  }
}

const pointFeatures = computed(() => {
  const features = validFeatures.value.filter(
    (feature) => feature.type === 'Point'
  )
  console.log('pointFeatures computed:', features)
  return features
})

function getFeatureIconPosition(feature) {
  if (feature.type === 'Point') {
    return feature.coordinates
  } else if (feature.type === 'Polygon') {
    const startPoint = feature.coordinates[0][0]
    return [startPoint[0] - 0.008, startPoint[1] + 0.005]
  }
}

onMounted(() => {
  console.log('BackgroundMap component mounted')
})
</script>
