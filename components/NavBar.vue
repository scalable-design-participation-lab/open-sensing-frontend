<template>
  <div
    class="fixed left-4 top-4 w-80 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
  >
    <UCard>
      <UAccordion :items="menuItems" class="space-y-4">
        <template #item="{ item }">
          <UCard>
            <div v-if="item.label === 'Space'" class="space-y-4">
              <UProgress
                :value="progressPercentage"
                color="yellow"
                class="mb-4"
              />
              <h2 class="text-xl font-semibold text-black">
                {{ subwindowContent.title }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ subwindowContent.description }}
              </p>

              <template v-if="currentSubwindow === 1">
                <UButton
                  v-for="button in spaceButtons"
                  :key="button.text"
                  :color="button.color"
                  class="w-full mb-2"
                  @click="mapUIStore.activateDrawing(button.text)"
                >
                  {{ button.text }}
                </UButton>
              </template>

              <template v-if="currentSubwindow >= 2 && currentSubwindow <= 4">
                <template v-if="currentSubwindow >= 3 && currentSubwindow <= 4">
                  <UButton
                    color="primary"
                    class="w-full mb-2"
                    @click="mapUIStore.activatePolygonDrawing()"
                  >
                    Draw Polygon
                  </UButton>
                  <p v-if="calculatedArea > 0" class="text-center text-primary">
                    Area: {{ calculatedArea }} square meters
                  </p>
                </template>
              </template>

              <UButtonGroup class="mt-4">
                <UButton
                  icon="i-heroicons-arrow-left-20-solid"
                  color="gray"
                  variant="ghost"
                  :disabled="currentSubwindow === 1"
                  @click="mapUIStore.prevSubwindow()"
                />
                <UButton
                  icon="i-heroicons-arrow-right-20-solid"
                  color="gray"
                  variant="ghost"
                  :disabled="currentSubwindow === 4"
                  @click="mapUIStore.nextSubwindow()"
                />
              </UButtonGroup>
            </div>
          </UCard>
        </template>
      </UAccordion>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapUIStore } from '../stores/mapUI'

const mapUIStore = useMapUIStore()

const currentSubwindow = computed(() => mapUIStore.currentSubwindow)
const comment = computed({
  get: () => mapUIStore.comment,
  set: (value) => (mapUIStore.comment = value),
})
const calculatedArea = computed(() => mapUIStore.calculatedArea)

const spaceButtons = [
  { text: 'every day', color: 'red' },
  { text: 'every week', color: 'green' },
  { text: 'sometimes', color: 'blue' },
  { text: 'only once', color: 'yellow' },
  { text: 'never', color: 'purple' },
]

const subwindowContent = computed(() => {
  switch (currentSubwindow.value) {
    case 1:
      return {
        title:
          'Mark the places on the map that you visited near the Tyazhilivka River.',
        description:
          'Using the "marker" tool, mark the places on the map where you have been near the Tyazhilivka River (up to 10 markers). For each marker, select how often you visit this location:',
      }
    case 2:
      return {
        title:
          'For what purpose do you visit the places you marked on the map and with whom?',
        description:
          'Click on a tag and comment on how and with whom you spend your time at that location. Click "add" to continue commenting on the next tag.',
      }
    case 3:
      return {
        title:
          'Outline the area where you would like to see recreational or cultural events.',
        description:
          'Using the "marker" tool, outline the boundaries of the area that, in your opinion, has the potential for hosting recreational, cultural, sports, educational, or other leisure activities. In the comment section below, explain why this area is suitable and what activities you would like to see there. Click "add" to move on to mapping the next area.',
      }
    case 4:
      return {
        title: 'Outline the area that restricts access to the river.',
        description:
          'Using the "marker" tool, draw the boundaries of the area that creates obstacles to access the river. In the window below, comment on what this obstacle is. Click "add" to proceed to mapping the next area.',
      }
    default:
      return { title: '', description: '' }
  }
})

const menuItems = [
  { icon: 'i-heroicons-map-pin-20-solid', label: 'Space' },
  { icon: 'i-heroicons-home-20-solid', label: 'Belonging' },
  { icon: 'i-heroicons-exclamation-triangle-20-solid', label: 'Safety' },
  { icon: 'i-heroicons-sun-20-solid', label: 'Environment' },
]

const progressPercentage = computed(() => (currentSubwindow.value / 4) * 100)
</script>
