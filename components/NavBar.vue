<template>
  <div class="fixed right-6 top-6 w-80 z-40 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
    <UCard>
      <UAccordion color="black" variant="solid" :items="menuItems" class="space-y-2">
        <template #item="{ item }">
          <SubWindow v-if="item.label === 'Середовище'" :current-subwindow="spaceSubwindow" :max-subwindow="3"
            :progress-percentage="spaceProgressPercentage" :title="spaceContent.title" :icon="spaceContent.icon"
            :paragraph="spaceContent.description" :button="spaceContent.button" :button-group="spaceContent.buttonGroup"
            @prev="mapUIStore.prevSpaceSubwindow()" @next="mapUIStore.nextSpaceSubwindow()">
          </SubWindow>
          <SubWindow v-if="item.label === 'Приналежність'" :current-subwindow="belongingSubwindow" :max-subwindow="1"
            :progress-percentage="belongingProgressPercentage" :title="belongingContent.title"
            :icon="belongingContent.icon" :paragraph="belongingContent.description"
            :icon-grid="belongingSubwindow === 1 ? belongingIconGrid : null" @prev="prevBelongingSubwindow"
            @next="nextBelongingSubwindow">
          </SubWindow>
          <SubWindow v-if="item.label === 'Безпека'" :current-subwindow="safetySubwindow" :max-subwindow="1"
            :progress-percentage="safetyProgressPercentage" :title="safetyContent.title" :icon="safetyContent.icon"
            :paragraph="safetyContent.description" :icon-grid="safetySubwindow === 1 ? safetyIconGrid : null"
            @prev="prevSafetySubwindow" @next="nextSafetySubwindow">
          </SubWindow>
          <SubWindow v-if="item.label === 'Екологія'" :current-subwindow="environmentSubwindow" :max-subwindow="2"
            :progress-percentage="environmentProgressPercentage" :title="environmentContent.title"
            :icon="environmentContent.icon" :paragraph="environmentContent.description" :icon-grid="environmentSubwindow === 1
              ? pollutionIconGrid
              : environmentSubwindow === 2
                ? leafIconGrid
                : null
              " @prev="prevEnvironmentSubwindow" @next="nextEnvironmentSubwindow">
          </SubWindow>
        </template>
      </UAccordion>

      <UButton v-if="showSubmitButton" class="mt-4 w-full" color="primary" :loading="isSaving" :disabled="isSaving"
        @click="saveData">
        {{ isSaving ? 'подаючи...' : 'завершити' }}
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
  { icon: 'i-heroicons-map-pin-20-solid', label: 'Середовище' },
  { icon: 'i-heroicons-home-20-solid', label: 'Приналежність' },
  { icon: 'i-heroicons-exclamation-triangle-20-solid', label: 'Безпека' },
  { icon: 'i-heroicons-sun-20-solid', label: 'Екологія' },
]

const spaceProgressPercentage = computed(() => (spaceSubwindow.value / 3) * 100)
const belongingProgressPercentage = computed(
  () => (belongingSubwindow.value / 1) * 100
)
const safetyProgressPercentage = computed(
  () => (safetySubwindow.value / 1) * 100
)
const environmentProgressPercentage = computed(
  () => (environmentSubwindow.value / 2) * 100
)

const spaceContent = computed(() => {
  const contents = {
    1: {
      title:
        'Позначте на мапі місця, які ви відвідували навколо р. Тяжилівка',
      description:
        'Спочатку оберіть частоту відвідування, а після позначте на мапі ту чи іншу локацію (до десяти).',
      buttonGroup: [
        {
          text: 'every day',
          color: 'blue',
          action: () => mapUIStore.activateDrawing('every day'),
        },
        {
          text: 'щотижня',
          color: 'green',
          action: () => mapUIStore.activateDrawing('every week'),
        },
        {
          text: 'інколи',
          color: 'purple',
          action: () => mapUIStore.activateDrawing('sometimes'),
        },
        {
          text: 'лише раз',
          color: '#B2FB4C',
          action: () => mapUIStore.activateDrawing('only once'),
        },
        {
          text: 'ніколи',
          color: 'red',
          action: () => mapUIStore.activateDrawing('never'),
        },
      ],
    },
    2: {
      title:
        'Позначте на мапі місця, у яких хочеться проводити дозвілля',
      description:
        'Торкніться екрана та оберіть ділянки, де в майбутньому бажаєте проводити час. Далі тисніть на + і залишайте коментар, які саме активності вбачаєте: ярмарок, барбекю, вигул собак тощо.',
      button: {
        text: 'додати',
        color: 'primary',
        action: () => mapUIStore.activatePolygonDrawing(),
      },
    },
    3: {
      title: 'Позначте на мапі шляхи, які ведуть до р. Тяжилівка',
      description:
        'Оберіть кнопку нижче і зазначте дорогу, яку ви обираєте, щоб добратися до річки.',
      button: {
        text: 'додати',
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
      title: 'Позначте на мапі конкретні місця навколо р. Тяжилівка й висловіть свою думку',
      description:
        'За допомогою іконок нижче поділіться, які ділянки не подобаються, подобаються або сповнені спогадів. Далі тисніть + і залишайте коментар, а також за бажанням зображення.',
    },
  }
  return contents[belongingSubwindow.value] || { title: '', description: '' }
})

const belongingIconGrid = computed(() => ({
  title: 'Виберіть іконку:',
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
      title: 'Позначте на мапі місця навколо р. Тяжилівка, де ви почуваєтесь безпечно або навпаки',
      description:
        'За допомогою іконок нижче вкажіть ділянки, які викликають у вас відчуття безпеки, небезпеки або спокою.',
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
      title: 'Позначте на мапі місця навколо р. Тяжилівка, де ви помічали сміття',
      description:
        'За допомогою іконки нижче поділіться, які ділянки засміченні. Далі тисніть + і залишайте коментар.',
    },
    2: {
      title: 'Позначте на мапі місця навколо р. Тяжилівка, де ви зустрічали незвичайні рослини або тварин',
      description:
        'За допомогою іконки нижче відмітьте, де бачили цікавих тварин, комах, дерева тощо. Далі тисніть + і залишайте коментар.',
    },
  }
  return contents[environmentSubwindow.value] || { title: '', description: '' }
})

const pollutionIconGrid = computed(() => ({
  title: 'Виберіть піктограму забруднення:',
  icons: [{ name: 'pollution', src: pollutionIcon }],
  onSelect: selectEnvironmentIcon,
}))

const leafIconGrid = computed(() => ({
  title: 'Виберіть іконку листка:',
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
  console.log('Піктограма вибраного середовища', iconName)
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
    showSuccessNotification('Thank you for taking the survey! You can now view your results or explore maps created by other users.')
    mapUIStore.resetAllSubwindows()
  } catch (error) {
    console.error('Error submitting data to database:', error)
    showErrorNotification('Не вдалося подати дані')
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
