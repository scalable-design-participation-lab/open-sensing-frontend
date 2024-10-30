<template>
  <UCard
    v-if="isVisible"
    class="registration-card max-w-[90vw] w-[500px] max-h-[90vh] overflow-y-auto z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-red-500 rounded-3xl bg-white shadow-xl scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
  >
    <template #header>
      <h3 class="text-xl md:text-2xl font-bold text-center mb-2 md:mb-4">
        реєстрація
      </h3>
    </template>

    <p class="mb-4 text-sm md:text-base px-4">
      Щоб взяти участь у Гуртомá, дайте відповіді на наступні запитання.
    </p>

    <UForm
      :state="formState"
      class="space-y-3 md:space-y-4 px-4 md:px-6"
      @submit="onSubmit"
    >
      <UFormGroup label="Прізвище" name="lastname">
        <UInput
          v-model="formState.lastname"
          placeholder="Введіть своє прізвище"
          color="yellow"
          variant="outline"
          size="md"
          class="rounded-full"
        />
      </UFormGroup>
      <UFormGroup label="Ім'я" name="firstname">
        <UInput
          v-model="formState.firstname"
          placeholder="Введіть своє ім'я"
          color="yellow"
          variant="outline"
          size="md"
          class="rounded-full"
        />
      </UFormGroup>
      <UFormGroup label="Вік" name="age">
        <UInput
          v-model="formState.age"
          type="number"
          placeholder="Введіть свій вік"
          color="yellow"
          variant="outline"
          size="md"
          class="rounded-full"
        />
      </UFormGroup>
      <UFormGroup label="Стать" name="gender">
        <USelect
          v-model="formState.gender"
          :options="genderOptions"
          placeholder="Виберіть свою стать"
          color="yellow"
          variant="outline"
          size="md"
          class="rounded-full"
        />
      </UFormGroup>
      <UFormGroup label="Education Level" name="educationLevel">
        <USelect
          v-model="formState.educationLevel"
          :options="educationOptions"
          placeholder="Виберіть рівень освіти"
          color="yellow"
          variant="outline"
          size="md"
          class="rounded-full"
        />
      </UFormGroup>
      <UFormGroup label="Мешканець з" name="residentSince">
        <USelect
          v-model="formState.residentSince"
          :options="residentOptions"
          placeholder="Як довго ви тут живете?"
          color="yellow"
          variant="outline"
          size="md"
          class="rounded-full"
        />
      </UFormGroup>
      <UFormGroup label="Житель Біля річки З" name="residentNearRiverSince">
        <UInput
          v-model="formState.residentNearRiverSince"
          placeholder="Enter year (e.g. 2022)"
          color="yellow"
          variant="outline"
          size="md"
          class="rounded-full"
        />
      </UFormGroup>

      <div class="flex justify-center mt-6 mb-4">
        <UButton
          type="submit"
          class="rounded-full bg-sky-400 hover:bg-sky-500 text-white px-6 py-2 text-base"
        >
          перейти до карти
        </UButton>
      </div>
    </UForm>

    <template #footer>
      <p class="text-xs text-gray-500 px-4 md:px-6 py-3 text-justify">
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

const auth = getAuth()
const props = defineProps({
  isVisible: Boolean,
})

const emit = defineEmits(['close'])

const mapUIStore = useMapUIStore()
const db = useFirestore()

const formState = reactive({
  lastname: '',
  firstname: '',
  age: '',
  gender: '',
  educationLevel: '',
  residentSince: '',
  residentNearRiverSince: '',
})

const genderOptions = [
  { label: 'Чоловік', value: 'male' },
  { label: 'Жінка', value: 'female' },
  { label: 'інші', value: 'other' },
]

const educationOptions = [
  { label: 'Вища школа', value: 'high_school' },
  { label: 'College', value: 'college' },
  { label: 'коледж', value: 'university' },
  { label: 'Аспірантура', value: 'postgraduate' },
]

const residentOptions = [
  { label: 'Менше 1 року', value: 'less_than_1_year' },
  { label: '1-5 років', value: '1_5_years' },
  { label: '5-10 років', value: '5_10_years' },
  { label: 'Більше 10 років', value: 'more_than_10_years' },
]

const onSubmit = async () => {
  try {
    const userCredential = await signInAnonymously(auth)
    const user = userCredential.user

    console.log('Anonymous authentication successful:', {
      uid: user.uid,
      isAnonymous: user.isAnonymous,
      creationTime: user.metadata.creationTime,
    })

    const usersCollection = collection(db, 'users')
    const docRef = await addDoc(usersCollection, {
      uid: user.uid,
      name: {
        lastname: formState.lastname,
        firstname: formState.firstname,
      },
      age: parseInt(formState.age),
      gender: formState.gender,
      'education level': formState.educationLevel,
      'resident since': formState.residentSince,
      'resident near river since': formState.residentNearRiverSince,
      createdAt: new Date(),
      isAnonymous: true,
    })

    console.log('User data saved to Firestore:', {
      docId: docRef.id,
      uid: user.uid,
      name: `${formState.firstname} ${formState.lastname}`,
    })

    mapUIStore.setUserData({
      ...formState,
      uid: user.uid,
    })
    emit('close')
  } catch (error) {
    console.error('Authentication error:', {
      code: error.code,
      message: error.message,
      stack: error.stack,
    })
  }
}
</script>
