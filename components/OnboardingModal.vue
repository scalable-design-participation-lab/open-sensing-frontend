<template>
  <UCard
    v-if="isVisible"
    class="onboarding-card max-w-[90vw] w-[500px] max-h-[90vh] overflow-y-auto z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl dark:bg-slate-950"
  >
    <template #header>
      <h3 class="text-xl md:text-2xl font-semibold text-center">
        Ласкаво просимо до Гуртомá
      </h3>
    </template>

    <div class="space-y-8 px-6">
      <p class="leading-tight">
        Гуртомá - це інтерактивна платформа для спільного картографування та
        обміну досвідом про нашу річку.
      </p>

      <div class="space-y-3 leading-tight">
        <div class="flex items-start space-x-3">
          <UIcon
            name="i-heroicons-map"
            class="flex-shrink-0 w-6 h-6 text-blue-500"
          />
          <p>
            Досліджуйте карту та діліться своїми спогадами про місця біля річки
          </p>
        </div>

        <div class="flex items-start space-x-3">
          <UIcon
            name="i-heroicons-chat-bubble-left-right"
            class="flex-shrink-0 w-6 h-6 text-blue-500"
          />
          <p>
            Беріть участь у дискусіях та обмінюйтесь історіями з іншими
            учасниками
          </p>
        </div>

        <div class="flex items-start space-x-3">
          <UIcon
            name="i-heroicons-camera"
            class="flex-shrink-0 w-6 h-6 text-blue-500"
          />
          <p>
            Завантажуйте фотографії та відео, щоб поділитися своїм баченням
            річки
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-center my-8 mb-4">
      <UButton
        color="black"
        class="px-6 py-2 rounded-full hover:bg-gray-300 hover:text-black dark:hover:bg-slate-600 dark:hover:text-white"
        @click="handleSignup"
      >
        Розпочати реєстрацію
      </UButton>
    </div>

    <template #footer>
      <p class="text-xs text-gray-500 px-6 py-3 leading-tight text-center">
        Гуртомá – це спільний проєкт <a href="https://www.restartfuture.org/" target="_blank">Restart</a> та <a href="https://northeastern.edu" target="_blank">Northeastern University</a>
      </p>
    </template>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['showRegistration'])

const handleSignup = () => {
  emit('showRegistration')
}
</script>
