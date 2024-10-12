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
        class="cursor-pointer text-black-500 rounded-full p-0.5 flex justify-center items-center shadow-md"
        @click.stop="handleIconClick(feature)"
      >
        <img
          src="@/assets/icons/open-icon.svg"
          alt="Open Icon"
          class="w-6 h-6"
        />
      </div>
    </ol-overlay>
  </template>
</template>

<script setup lang="ts">
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
})

const emit = defineEmits(['toggle-comment-popup', 'toggle-image-upload-popup'])

const mapUIStore = useMapUIStore()

function handleIconClick(feature) {
  if (
    feature.iconName === 'heart' ||
    feature.iconName === 'smile' ||
    feature.iconName === 'dislike' ||
    feature.iconName === 'broken' ||
    feature.iconName === 'calm' ||
    feature.iconName === 'lock'
  ) {
    emit('toggle-image-upload-popup', feature)
  } else {
    emit('toggle-comment-popup', feature)
  }
}
</script>
