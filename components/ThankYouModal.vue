<template>
  <UModal v-model="isOpen" :ui="{ width: 'md:max-w-xl' }">
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <h3 class="text-xl font-semibold">Дякуємо за участь!</h3>
        </div>
      </template>

      <div class="space-y-4">
        <p>
          Ваші відповіді успішно збережено. Вони допоможуть нам краще зрозуміти
          потреби громади.
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="black" variant="solid" @click="viewResults">
            Переглянути результати
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])
const router = useRouter()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function viewResults() {
  isOpen.value = false
  router.push({
    path: '/map',
    query: { showIntro: 'true' },
  })
}
</script>
