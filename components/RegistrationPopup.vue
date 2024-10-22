<template>
  <UCard
    v-if="isVisible"
    class="w-96 z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <template #header>
      <h3 class="text-lg font-bold">Registration</h3>
    </template>
    <p class="mb-4">
      In order to participate in Restart-Ukraine, please register by answering
      the following questions.
    </p>
    <UForm :state="formState" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="How old are you?" name="age">
        <UInput
          v-model="formState.age"
          type="number"
          placeholder="Enter your age"
        />
      </UFormGroup>
      <UFormGroup label="Indicate your gender:" name="gender">
        <USelect
          v-model="formState.gender"
          :options="genderOptions"
          placeholder="Choose an answer"
        />
      </UFormGroup>
      <UFormGroup label="What's your education level?" name="educationLevel">
        <USelect
          v-model="formState.educationLevel"
          :options="educationOptions"
          placeholder="Choose an answer"
        />
      </UFormGroup>
      <UFormGroup
        label="How long have you lived in the city?"
        name="residentSince"
      >
        <USelect
          v-model="formState.residentSince"
          :options="residentOptions"
          placeholder="Choose an answer"
        />
      </UFormGroup>
      <UFormGroup
        label="Do you live next to Tyazhylivka river?"
        name="residentNearRiver"
      >
        <USelect
          v-model="formState.residentNearRiver"
          :options="yesNoOptions"
          placeholder="Choose an answer"
        />
      </UFormGroup>
      <UButton type="submit" color="primary" class="w-full">
        Go to the map
      </UButton>
    </UForm>
    <template #footer>
      <p class="text-xs text-gray-500">
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

const props = defineProps({
  isVisible: Boolean,
})

const emit = defineEmits(['close'])

const mapUIStore = useMapUIStore()

const formState = reactive({
  age: '',
  gender: '',
  educationLevel: '',
  residentSince: '',
  residentNearRiver: '',
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

const yesNoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
]

const onSubmit = () => {
  // Here you would typically send the form data to your backend or Firestore
  console.log('Form submitted:', formState)
  mapUIStore.setUserData(formState)
  emit('close')
}
</script>
