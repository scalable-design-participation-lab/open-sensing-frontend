<template>
  <UCard
    v-if="isVisible"
    class="registration-card max-w-[90vw] w-[500px] max-h-[90vh] overflow-y-auto z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
  >
    <template #header>
      <h3 class="text-xl md:text-2xl font-semibold text-center">
        Ласкаво просимо
      </h3>
    </template>

    <p class="mb-4 px-6 leading-tight">
      Щоб взяти участь у Гуртомá, дайте відповіді на наступні запитання.
    </p>

    <template #footer>
      <p class="text-xs text-gray-500 px-4 py-3 md:px-6 leading-tight">
        Беручи участь в цьому опитуванні, ви даєте згоду на збір та використання
        ваших відповідей в дослідницьких цілях. Ваші персональні дані залишаться
        конфіденційними і не будуть передані третім особам без вашої згоди, за
        винятком випадків, передбачених законодавством. Однак будь-які надані
        вами медіафайли та коментарі будуть опубліковані. Участь у дослідженні є
        добровільною, і ви можете відмовитися від неї в будь-який час.
      </p>
    </template>
  </UCard>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useMapUIStore } from '../stores/mapUI'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { useFirestore } from 'vuefire'
import { collection, addDoc } from 'firebase/firestore'

const props = defineProps({
  isVisible: Boolean,
})

const emit = defineEmits(['close'])

const mapUIStore = useMapUIStore()

</script>
