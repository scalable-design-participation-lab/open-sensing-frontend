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
          </SubWindow>
          <SubWindow
            v-if="item.label === 'Belonging'"
            :current-subwindow="belongingSubwindow"
            :max-subwindow="2"
            :progress-percentage="belongingProgressPercentage"
            :title="belongingContent.title"
            :icon="belongingContent.icon"
            :paragraph="belongingContent.description"
            :icon-grid="belongingSubwindow === 1 ? belongingIconGrid : null"
            @prev="prevBelongingSubwindow"
            @next="nextBelongingSubwindow"
          >
          </SubWindow>
        </template>
      </UAccordion>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMapUIStore } from '../stores/mapUI'
import SubWindow from './SubWindow.vue'

import dislikeIcon from '@/assets/icons/dislike.svg'
import heartIcon from '@/assets/icons/heart.svg'
import smileIcon from '@/assets/icons/smile.svg'

const mapUIStore = useMapUIStore()

const currentSubwindow = computed(() => mapUIStore.currentSubwindow)
const belongingSubwindow = ref(1)

const menuItems = [
  { icon: 'i-heroicons-map-pin-20-solid', label: 'Space' },
  { icon: 'i-heroicons-home-20-solid', label: 'Belonging' },
  { icon: 'i-heroicons-exclamation-triangle-20-solid', label: 'Safety' },
  { icon: 'i-heroicons-sun-20-solid', label: 'Environment' },
]

const progressPercentage = computed(() => (currentSubwindow.value / 4) * 100)
const belongingProgressPercentage = computed(
  () => (belongingSubwindow.value / 2) * 100
)

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
    Belonging: {
      1: {
        title: 'Mark places that are important to you',
        icon: 'i-heroicons-home-20-solid',
        description:
          'Select an icon and place it on the map to mark locations that are significant to you.',
      },
      2: {
        title: 'Describe why these places are important',
        icon: 'i-heroicons-chat-bubble-left-20-solid',
        description:
          'Click on the icons you placed and add comments to explain why these locations are meaningful to you.',
      },
    },
  }
  return contents[currentSubwindow.value] || { title: '', description: '' }
})

const belongingContent = computed(() => {
  const contents = {
    1: {
      title: 'Mark places that are important to you',
      icon: 'i-heroicons-home-20-solid',
      description:
        'Select an icon and place it on the map to mark locations that are significant to you.',
    },
    2: {
      title: 'Describe why these places are important',
      icon: 'i-heroicons-chat-bubble-left-20-solid',
      description:
        'Click on the icons you placed and add comments to explain why these locations are meaningful to you.',
    },
  }
  return contents[belongingSubwindow.value] || { title: '', description: '' }
})

const belongingIconGrid = computed(() => ({
  title: 'Select an icon:',
  icons: [
    { name: 'dislike', src: dislikeIcon },
    { name: 'heart', src: heartIcon },
    { name: 'smile', src: smileIcon },
  ],
  onSelect: selectBelongingIcon,
}))

function nextBelongingSubwindow() {
  if (belongingSubwindow.value < 2) {
    belongingSubwindow.value++
  }
}

function prevBelongingSubwindow() {
  if (belongingSubwindow.value > 1) {
    belongingSubwindow.value--
  }
}

function selectBelongingIcon(iconName: string) {
  console.log('Selected icon:', iconName)
  mapUIStore.activateBelongingDrawing(iconName)
}
</script>
