<template>
  <div
    class="fixed right-6 top-24 w-96 md:w-80 z-40 shadow-xl"
  >
    <UCard class="dark:bg-slate-950">
      <UAccordion
        color="white"
        variant="solid"
        :items="menuItems"
        class="space-y-1"
      >
        <template #item="{ item }">
          <SubWindow
            v-if="item.label === 'Середовище'"
            :current-subwindow="spaceSubwindow"
            :max-subwindow="3"
            :progress-percentage="spaceProgressPercentage"
            :title="spaceContent.title"
            :icon="spaceContent.icon"
            :paragraph="spaceContent.description"
            :button="spaceContent.button"
            :button-group="spaceContent.buttonGroup"
            @prev="mapUIStore.prevSpaceSubwindow()"
            @next="mapUIStore.nextSpaceSubwindow()"
            class="!text-xl"
          >
          </SubWindow>
          <SubWindow
            v-if="item.label === 'Приналежність'"
            :current-subwindow="belongingSubwindow"
            :max-subwindow="1"
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
            v-if="item.label === 'Безпека'"
            :current-subwindow="safetySubwindow"
            :max-subwindow="1"
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
            v-if="item.label === 'Екологія'"
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
        class="mt-2 py-3 px-6 rounded-full flex place-self-end hover:bg-gray-300 hover:text-black dark:hover:bg-slate-600 dark:hover:text-white"
        color="black"
        :loading="isSaving"
        :disabled="isSaving"
        @click="saveData"
      >
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
  {
    icon: 'i-heroicons-map-pin-20-solid',
    label: 'Середовище',
    defaultOpen: true,
  },
  { icon: 'i-heroicons-home-20-solid', label: 'Приналежність' },
  { icon: 'i-heroicons-exclamation-triangle-20-solid', label: 'Безпека' },
  { icon: 'i-heroicons-sun-20-solid', label: 'Екологія' },
]

const spaceProgressPercentage = computed(() => (spaceSubwindow.value / 3) * 100)
const belongingProgressPercentage = computed(
  () => (belongingSubwindow.value / 1) * 100,
)
const safetyProgressPercentage = computed(
  () => (safetySubwindow.value / 1) * 100,
)
const environmentProgressPercentage = computed(
  () => (environmentSubwindow.value / 2) * 100,
)

const spaceContent = computed(() => {
  const contents = {
    1: {
      title: 'Позначте місця, які ви відвідували навколо р. Тяжилівка',
      description:
        'Виберіть частоту відвідування за допомогою кнопки нижче, а потім позначте відповідні місця на мапі. За потреби натисніть на іконку «Плюс», щоб додати коментарі.',
      buttonGroup: [
        {
          text: 'щодня',
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
          color: 'yellow',
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
      title: 'Позначте місця для дозвілля навколо р. Тяжилівка',
      description:
        'Натисніть «Додати» і виділіть територію на мапі, де хочете проводити час у майбутньому — відпочивати з друзями, гуляти з собакою тощо. Щоб зберегти результат, двічі натисніть на виділену зону.',
      button: {
        text: 'додати',
        color: 'primary',
        action: () => mapUIStore.activatePolygonDrawing(),
      },
    },
    3: {
      title: 'Позначте дороги, які ведуть до р. Тяжилівка',
      description:
        'Щоб зручніше позначити місця, наблизьте мапу за допомогою масштабування та натисніть «Додати». Далі у кілька натискань відмітьте всі відомі вам дороги до річки, і після цього переходьте до розділу «Приналежність».',
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
      title:
        'Поділіться думкою про місця навколо р. Тяжилівка',
      description:
        'Оберіть іконку (навівши на неї, побачити підказку) та позначте на мапі місця, які вам подобаються, не подобаються або які викликають відчуття спокою. Додайте коментар із поясненням, і після цього переходьте до розділу «Безпека».',
    },
  }
  return contents[belongingSubwindow.value] || { title: '', description: '' }
})

const belongingIconGrid = computed(() => ({
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
      title:
        'Позначте на мапі місця навколо р. Тяжилівка, де ви почуваєтесь безпечно або навпаки',
      description:
        'За допомогою іконок нижче вкажіть ділянки, які викликають у вас відчуття безпеки, небезпеки або спокою.',
    },
  }
  return contents[safetySubwindow.value] || { title: '', description: '' }
})

const safetyIconGrid = computed(() => ({
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
      title:
        'Позначте на мапі місця навколо р. Тяжилівка, де ви помічали сміття',
      description:
        'За допомогою іконки нижче поділіться, які ділянки засміченні. Далі тисніть + і залишайте коментар.',
    },
    2: {
      title:
        'Позначте на мапі місця навколо р. Тяжилівка, де ви зустрічали незвичайні рослини або тварин',
      description:
        'За допомогою іконки нижче відмітьте, де бачили цікавих тварин, комах, дерева тощо. Далі тисніть + і залишайте коментар.',
    },
  }
  return contents[environmentSubwindow.value] || { title: '', description: '' }
})

const pollutionIconGrid = computed(() => ({
  icons: [{ name: 'pollution', src: pollutionIcon }],
  onSelect: selectEnvironmentIcon,
}))

const leafIconGrid = computed(() => ({
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
    showSuccessNotification(
      'Thank you for taking the survey! You can now view your results or explore maps created by other users.',
    )
    // mapUIStore.resetAllSubwindows()
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
