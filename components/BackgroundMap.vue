<template>
  <ol-map
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    style="width: 100%; height: 100vh"
    @click="handleMapClick"
  >
    <ol-view
      ref="view"
      :center="[28.41097, 49.23278]"
      :zoom="18"
      :projection="projection"
    />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <ol-tile-layer>
      <ol-source-tile-arcgis-rest
        :url="arcgisUrl"
        :tile-size="[1024, 1024]"
        :params="requestParams"
      />
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

        <ol-feature v-for="feature in validFeatures" :key="feature.id">
          <ol-geom-point
            v-if="feature.type === 'Point'"
            :coordinates="feature.coordinates"
          />
          <ol-geom-polygon
            v-else-if="feature.type === 'Polygon'"
            :coordinates="feature.coordinates"
          />
          <ol-geom-line-string
            v-else-if="feature.type === 'LineString'"
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
              <ol-style-stroke color="black" :width="2" :line-dash="[10, 10]" />
              <ol-style-fill :color="[0, 0, 0, 0]" />
            </template>
            <template v-else-if="feature.type === 'LineString'">
              <ol-style-stroke color="red" :width="2" :line-dash="[6, 6]" />
            </template>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>

    <ol-overlay
      v-for="feature in visibleFeatures"
      :key="feature.id"
      :position="getFeatureIconPosition(feature)"
      :offset="[0, 0]"
    >
      <div
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

    <ol-overlay
      v-for="feature in lineStringFeatures"
      :key="`start-${feature.id}`"
      :position="getLineStringStartPoint(feature)"
      :offset="[0, 0]"
    >
      <div class="prohibit-icon" @click.stop="toggleCommentPopup(feature)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="red"
          width="24"
          height="24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"
          />
        </svg>
      </div>
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

const arcgisUrl =
  'https://services.wvgis.wvu.edu/arcgis/rest/services/Imagery_BaseMaps_EarthCover/wv_imagery_WVGISTC_leaf_off_mosaic/MapServer'
const requestParams = {
  layers: 'show:30,27,24,23,22',
  format: 'PNG32',
  f: 'image',
  dpi: 96,
  transparent: true,
  bboxSR: 102100,
  imageSR: 102100,
  size: '1024,1024',
  _ts: false,
}

const visibleFeatures = computed(() => {
  const currentSubwindow = mapUIStore.currentSubwindow
  if (currentSubwindow === 2) {
    return validFeatures.value.filter((feature) => feature.type === 'Point')
  } else if (currentSubwindow === 3) {
    return validFeatures.value.filter((feature) => feature.type === 'Polygon')
  } else {
    return []
  }
})

const lineStringFeatures = computed(() =>
  validFeatures.value.filter((feature) => feature.type === 'LineString')
)

function getLineStringStartPoint(feature) {
  return feature.coordinates[0]
}

function handleDrawStart(event) {
  mapUIStore.handleDrawStart(event)
}

function handleDrawEnd(event) {
  const feature = event.feature
  const geometry = feature.getGeometry()
  const geometryType = geometry.getType()

  if (geometryType === 'LineString') {
    const coordinates = geometry.getCoordinates()
    mapUIStore.addFeature({
      type: 'LineString',
      coordinates: coordinates,
    })
  } else if (geometryType === 'Point') {
    const coordinate = geometry.getCoordinates()
    mapUIStore.addFeature({
      type: 'Point',
      coordinates: coordinate,
      frequency: mapUIStore.currentFrequency,
    })
  } else if (geometryType === 'Polygon') {
    const coordinates = geometry.getCoordinates()
    mapUIStore.addFeature({
      type: 'Polygon',
      coordinates: coordinates,
    })
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
    return [startPoint[0], startPoint[1]]
  }
  return [0, 0]
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

onMounted(() => {
  console.log('BackgroundMap component mounted')
})
</script>

<style scoped>
.prohibit-icon {
  cursor: pointer;
}
</style>
