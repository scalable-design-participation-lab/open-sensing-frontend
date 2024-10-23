<template>
  <div
    class="fixed right-6 top-6 w-80 z-40 bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
  >
    <UCard>
      <UAccordion
        color="black"
        variant="solid"
        :items="menuItems"
        class="space-y-2"
      >
        <template #item="{ item }">
          <SubWindow
            v-if="item.label === 'Space'"
            :current-subwindow="spaceSubwindow"
            :max-subwindow="4"
            :progress-percentage="spaceProgressPercentage"
            :title="spaceContent.title"
            :icon="spaceContent.icon"
            :paragraph="spaceContent.description"
            :button="spaceContent.button"
            :button-group="spaceContent.buttonGroup"
            @prev="mapUIStore.prevSpaceSubwindow()"
            @next="mapUIStore.nextSpaceSubwindow()"
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
          <SubWindow
            v-if="item.label === 'Safety'"
            :current-subwindow="safetySubwindow"
            :max-subwindow="2"
            :progress-percentage="safetyProgressPercentage"
            :title="safetyContent.title"
            :icon="safetyContent.icon"
            :paragraph="safetyContent.description"
            :icon-grid="safetySubwindow === 1 ? safetyIconGrid : null"
            @prev="prevSafetySubwindow"
            @next="nextSafetySubwindow"
          >
          </SubWindow>
          <SubWindow
            v-if="item.label === 'Environment'"
            :current-subwindow="environmentSubwindow"
            :max-subwindow="2"
            :progress-percentage="environmentProgressPercentage"
            :title="environmentContent.title"
            :icon="environmentContent.icon"
            :paragraph="environmentContent.description"
            :icon-grid="
              environmentSubwindow === 1
                ? pollutionIconGrid
                : environmentSubwindow === 2
                ? leafIconGrid
                : null
            "
            @prev="prevEnvironmentSubwindow"
            @next="nextEnvironmentSubwindow"
          >
          </SubWindow>
        </template>
      </UAccordion>

      <UButton
        v-if="showSubmitButton"
        class="mt-4 w-full"
        color="primary"
        :loading="isSaving"
        :disabled="isSaving"
        @click="saveData"
      >
        {{ isSaving ? 'Submitting...' : 'Submit' }}
      </UButton>
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
import brokenIcon from '@/assets/icons/broken.svg'
import calmIcon from '@/assets/icons/calm.svg'
import lockIcon from '@/assets/icons/lock.svg'
import pollutionIcon from '@/assets/icons/pollution.svg'
import leafIcon from '@/assets/icons/leaf.svg'

const mapUIStore = useMapUIStore()

const spaceSubwindow = computed(() => mapUIStore.spaceSubwindow)
const belongingSubwindow = computed(() => mapUIStore.belongingSubwindow)
const safetySubwindow = computed(() => mapUIStore.safetySubwindow)
const environmentSubwindow = computed(() => mapUIStore.environmentSubwindow)

const menuItems = [
  { icon: 'i-heroicons-map-pin-20-solid', label: 'Space' },
  { icon: 'i-heroicons-home-20-solid', label: 'Belonging' },
  { icon: 'i-heroicons-exclamation-triangle-20-solid', label: 'Safety' },
  { icon: 'i-heroicons-sun-20-solid', label: 'Environment' },
]

const spaceProgressPercentage = computed(() => (spaceSubwindow.value / 4) * 100)
const belongingProgressPercentage = computed(
  () => (belongingSubwindow.value / 2) * 100
)
const safetyProgressPercentage = computed(
  () => (safetySubwindow.value / 2) * 100
)
const environmentProgressPercentage = computed(
  () => (environmentSubwindow.value / 2) * 100
)

const spaceContent = computed(() => {
  const contents = {
    1: {
      title:
        'Mark the places on the map that you visited near the Tyazhilivka River.',
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
  return contents[spaceSubwindow.value] || { title: '', description: '' }
})

const belongingContent = computed(() => {
  const contents = {
    1: {
      title: 'Mark places that are important to you',
      description:
        'Select an icon and place it on the map to mark locations that are significant to you.',
    },
    2: {
      title: 'Describe why these places are important',
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

const safetyContent = computed(() => {
  const contents = {
    1: {
      title: 'Mark safe and unsafe areas',
      description:
        'Select an icon and place it on the map to mark safe or unsafe locations.',
    },
    2: {
      title: 'Describe safety concerns',
      description:
        'Click on the icons you placed and add comments to explain your safety concerns or positive aspects.',
    },
  }
  return contents[safetySubwindow.value] || { title: '', description: '' }
})

const safetyIconGrid = computed(() => ({
  title: 'Select an icon:',
  icons: [
    { name: 'broken', src: brokenIcon },
    { name: 'calm', src: calmIcon },
    { name: 'lock', src: lockIcon },
  ],
  onSelect: selectSafetyIcon,
}))

const environmentContent = computed(() => {
  const contents = {
    1: {
      title: 'Mark areas with environmental pollution',
      description:
        'Select the pollution icon and place it on the map to mark locations where you have noticed environmental pollution.',
    },
    2: {
      title: 'Mark locations with unique flora or fauna',
      description:
        'Select the leaf icon and place it on the map to mark locations where you have encountered special flora or fauna.',
    },
  }
  return contents[environmentSubwindow.value] || { title: '', description: '' }
})

const pollutionIconGrid = computed(() => ({
  title: 'Select the pollution icon:',
  icons: [{ name: 'pollution', src: pollutionIcon }],
  onSelect: selectEnvironmentIcon,
}))

const leafIconGrid = computed(() => ({
  title: 'Select the leaf icon:',
  icons: [{ name: 'leaf', src: leafIcon }],
  onSelect: selectEnvironmentIcon,
}))

const showSubmitButton = computed(() => {
  return environmentSubwindow.value === 2
})

function nextBelongingSubwindow() {
  mapUIStore.nextBelongingSubwindow()
}

function prevBelongingSubwindow() {
  mapUIStore.prevBelongingSubwindow()
}

function selectBelongingIcon(iconName: string) {
  console.log('Selected icon:', iconName)
  mapUIStore.activateBelongingDrawing(iconName)
}

function nextSafetySubwindow() {
  mapUIStore.nextSafetySubwindow()
}

function prevSafetySubwindow() {
  mapUIStore.prevSafetySubwindow()
}

function selectSafetyIcon(iconName: string) {
  console.log('Selected safety icon:', iconName)
  mapUIStore.activateSafetyDrawing(iconName)
}

function nextEnvironmentSubwindow() {
  mapUIStore.nextEnvironmentSubwindow()
}

function prevEnvironmentSubwindow() {
  mapUIStore.prevEnvironmentSubwindow()
}

function selectEnvironmentIcon(iconName: string) {
  console.log('Selected environment icon:', iconName)
  mapUIStore.activateEnvironmentDrawing(iconName)
}

const isSaving = ref(false)
const showNotification = ref(false)
const notificationColor = ref('green')
const notificationTitle = ref('')
const notificationText = ref('')
const notificationId = ref('save-notification')

async function saveData() {
  isSaving.value = true
  try {
    await mapUIStore.saveDataToDatabase()
    showSuccessNotification('Data submitted successfully')
    mapUIStore.resetAllSubwindows()
  } catch (error) {
    console.error('Error submitting data to database:', error)
    showErrorNotification('Failed to submit data')
  } finally {
    isSaving.value = false
  }
}

function showSuccessNotification(message: string) {
  notificationColor.value = 'green'
  notificationTitle.value = 'Success'
  notificationText.value = message
  showNotification.value = true
}

function showErrorNotification(message: string) {
  notificationColor.value = 'red'
  notificationTitle.value = 'Error'
  notificationText.value = message
  showNotification.value = true
}
</script>
