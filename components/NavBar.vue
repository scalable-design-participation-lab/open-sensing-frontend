<template>
  <div
    class="fixed left-4 top-4 w-80 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
  >
    <UCard>
      <UAccordion :items="menuItems" class="space-y-4">
        <template #item="{ item }">
          <SubWindow
            v-if="item.label === 'Space'"
            :current-subwindow="currentSubwindow"
            :max-subwindow="4"
            :progress-percentage="progressPercentage"
            :title="subwindowContent.title"
            :icon="subwindowContent.icon"
            :paragraph="subwindowContent.description"
            :button="subwindowContent.button"
            :button-group="subwindowContent.buttonGroup"
            @prev="mapUIStore.prevSubwindow()"
            @next="mapUIStore.nextSubwindow()"
          >
            <template v-if="currentSubwindow === 3 && calculatedArea > 0">
              <p class="text-center text-primary">
                Area: {{ calculatedArea }} square meters
              </p>
            </template>
          </SubWindow>
        </template>
      </UAccordion>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapUIStore } from '../stores/mapUI'
import SubWindow from './SubWindow.vue'

const mapUIStore = useMapUIStore()

const currentSubwindow = computed(() => mapUIStore.currentSubwindow)
const calculatedArea = computed(() => mapUIStore.calculatedArea)

const menuItems = [
  { icon: 'i-heroicons-map-pin-20-solid', label: 'Space' },
  { icon: 'i-heroicons-home-20-solid', label: 'Belonging' },
  { icon: 'i-heroicons-exclamation-triangle-20-solid', label: 'Safety' },
  { icon: 'i-heroicons-sun-20-solid', label: 'Environment' },
]

const progressPercentage = computed(() => (currentSubwindow.value / 4) * 100)

const subwindowContent = computed(() => {
  const contents = {
    1: {
      title:
        'Mark the places on the map that you visited near the Tyazhilivka River.',
      icon: 'i-heroicons-map-pin-20-solid',
      description:
        'Using the "marker" tool, mark the places on the map where you have been near the Tyazhilivka River (up to 10 markers). For each marker, select how often you visit this location:',
      buttonGroup: [
        {
          text: 'every day',
          color: 'red',
          action: () => mapUIStore.activateDrawing('every day'),
        },
        {
          text: 'every week',
          color: 'green',
          action: () => mapUIStore.activateDrawing('every week'),
        },
        {
          text: 'sometimes',
          color: 'blue',
          action: () => mapUIStore.activateDrawing('sometimes'),
        },
        {
          text: 'only once',
          color: 'yellow',
          action: () => mapUIStore.activateDrawing('only once'),
        },
        {
          text: 'never',
          color: 'purple',
          action: () => mapUIStore.activateDrawing('never'),
        },
      ],
    },
    2: {
      title:
        'For what purpose do you visit the places you marked on the map and with whom?',
      description:
        'Click on a tag and comment on how and with whom you spend your time at that location. Click "add" to continue commenting on the next tag.',
    },
    3: {
      title:
        'Outline the area where you would like to see recreational or cultural events.',
      description:
        'Using the "Draw Polygon" tool, outline the boundaries of the area that, in your opinion, has the potential for hosting recreational, cultural, sports, educational, or other leisure activities. In the comment section below, explain why this area is suitable and what activities you would like to see there. Click "add" to move on to mapping the next area.',
      button: {
        text: 'Draw Polygon',
        color: 'primary',
        action: () => mapUIStore.activatePolygonDrawing(),
      },
    },
    4: {
      title: 'Mark the areas that restrict access to the river.',
      description:
        'Using the "Draw Restricted Access" tool, draw lines to indicate areas that create obstacles to access the river. After drawing, click on the red prohibition icon to add a comment about the obstacle. Click "add" to proceed to mapping the next restricted area.',
      button: {
        text: 'Draw Restricted Access',
        color: 'red',
        action: () => mapUIStore.activateLineStringDrawing(),
      },
    },
  }

  return contents[currentSubwindow.value] || { title: '', description: '' }
})
</script>
