<template>
  <ol-feature v-for="feature in features" :key="feature.id">
    <ol-geom-point :coordinates="feature.coordinates" />
    <ol-style>
      <ol-style-icon
        :src="getIconForFeature(feature)"
        :scale="0.5"
        :anchor="[0.5, 0.5]"
      />
    </ol-style>
  </ol-feature>

  <ol-overlay
    v-for="feature in visibleFeatures"
    :key="`overlay-${feature.id}`"
    :position="feature.coordinates"
    :offset="[0, 0]"
  >
    <div
      class="cursor-pointer text-black-500 rounded-full p-0.5 flex justify-center items-center shadow-md"
      @click.stop="toggleCommentPopup(feature)"
    >
      <img src="@/assets/icons/open-icon.svg" alt="Open Icon" class="w-4 h-4" />
    </div>
  </ol-overlay>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'

const props = defineProps({
  features: {
    type: Array,
    required: true,
  },
  getIconForFeature: {
    type: Function,
    required: true,
  },
  visibleInSubwindow: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['toggle-comment-popup'])

const mapUIStore = useMapUIStore()

const visibleFeatures = computed(() => {
  const currentSubwindow = mapUIStore.currentSubwindow
  return currentSubwindow === props.visibleInSubwindow ? props.features : []
})

function toggleCommentPopup(feature) {
  emit('toggle-comment-popup', feature)
}
</script>
