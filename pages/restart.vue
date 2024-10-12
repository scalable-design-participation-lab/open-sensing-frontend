<template>
  <div>
    <!-- <BackgroundMap />
    <NavBar /> -->
    <ImageUploadPopup
      :is-visible="true"
      @close="showImageUploadPopup = false"
      @upload="handleImageUpload"
    />
  </div>
</template>

<script setup lang="ts">
import NavBar from '~/components/NavBar.vue'
import { ref } from 'vue'

const showImageUploadPopup = ref(false)

function handleImageUpload(imageData: string) {
  // Handle the uploaded image data
  console.log('Image uploaded:', imageData)
}
</script>
