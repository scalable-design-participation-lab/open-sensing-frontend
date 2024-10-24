<template>
  <UCard
    v-if="isVisible"
    class="registration-card max-w-[90vw] w-[500px] max-h-[90vh] overflow-y-auto z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-red-500 rounded-3xl bg-white shadow-xl scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
  >
    <template #header>
      <h3 class="text-xl md:text-2xl font-bold text-center mb-2 md:mb-4">
        Registration
      </h3>
    </template>

    <p class="mb-4 text-sm md:text-base px-4">
      In order to participate in Restart-Ukraine, please answer the following
      questions.
    </p>

    <UForm
      :state="formState"
      class="space-y-3 md:space-y-4 px-4 md:px-6"
      @submit="onSubmit"
    >
      <UFormGroup label="Last Name" name="lastname">
        <UInput
          v-model="formState.lastname"
          placeholder="Enter your last name"
          color="yellow"
          variant="outline"
          size="md"
          class="rounded-full"
        />
      </UFormGroup>
      <UFormGroup label="First Name" name="firstname">
        <UInput
          v-model="formState.firstname"
          placeholder="Enter your first name"
          color="yellow"
          variant="outline"
          size="md"
          class="rounded-full"
        />
      </UFormGroup>
      <UFormGroup label="Age" name="age">
        <UInput
          v-model="formState.age"
          type="number"
          placeholder="Enter your age"
          color="yellow"
          variant="outline"
          size="md"
          class="rounded-full"
        />
      </UFormGroup>
      <UFormGroup label="Gender" name="gender">
        <USelect
          v-model="formState.gender"
          :options="genderOptions"
          placeholder="Choose your gender"
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
          placeholder="Choose your education level"
          color="yellow"
          variant="outline"
          size="md"
          class="rounded-full"
        />
      </UFormGroup>
      <UFormGroup label="Resident Since" name="residentSince">
        <USelect
          v-model="formState.residentSince"
          :options="residentOptions"
          placeholder="How long have you lived here?"
          color="yellow"
          variant="outline"
          size="md"
          class="rounded-full"
        />
      </UFormGroup>
      <UFormGroup
        label="Resident Near River Since"
        name="residentNearRiverSince"
      >
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
          go to the map
        </UButton>
      </div>
    </UForm>

    <template #footer>
      <p class="text-xs text-gray-500 px-4 md:px-6 py-3 text-justify">
        By participating in this survey, you consent to the collection and use
        of your responses for research purposes. Your personal data will remain
        confidential and will not be shared with third parties without your
        consent, except as required by law. However, any media files and
        comments you provide will be made public. Participation is voluntary,
        and you may withdraw at any time.
      </p>
    </template>
  </UCard>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useMapUIStore } from '../stores/mapUI'
import { useFirebaseAuth } from 'vuefire'
import { signInAnonymously } from 'firebase/auth'
import { useFirestore } from 'vuefire'
import { collection, addDoc } from 'firebase/firestore'

const props = defineProps({
  isVisible: Boolean,
})

const emit = defineEmits(['close'])

const mapUIStore = useMapUIStore()
const auth = useFirebaseAuth()
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
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

const educationOptions = [
  { label: 'High School', value: 'high_school' },
  { label: 'College', value: 'college' },
  { label: 'University', value: 'university' },
  { label: 'Postgraduate', value: 'postgraduate' },
]

const residentOptions = [
  { label: 'Less than 1 year', value: 'less_than_1_year' },
  { label: '1-5 years', value: '1_5_years' },
  { label: '5-10 years', value: '5_10_years' },
  { label: 'More than 10 years', value: 'more_than_10_years' },
]

const onSubmit = async () => {
  try {
    const userCredential = await signInAnonymously(auth)
    const user = userCredential.user

    const usersCollection = collection(db, 'users')
    await addDoc(usersCollection, {
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
    })

    console.log('User registered and data saved:', formState)
    mapUIStore.setUserData(formState)
    emit('close')
  } catch (error) {
    console.error('Error registering user:', error)
  }
}
</script>
