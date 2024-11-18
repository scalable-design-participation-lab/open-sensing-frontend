<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-xl' }">
    <UCard>
      <!-- Header -->
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">Про проєкт</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="closeModal"
          />
        </div>
      </template>

      <!-- Content -->
      <div class="space-y-4">
        <p>
          «Гуртомá» — проєкт зі спільного створення мапи завдяки містянам, який дозволяє дослідити питання використання й ставлення до навколишнього простору.
        </p>

        <div class="space-y-2">
          <h4 class="font-medium">Ключові особливості:</h4>
          <ul class="list-disc list-inside space-y-1 pl-4">
            <li>Малюйте та позначайте місця, які ви відвідуєте та використовуєте для певної мети</li>
            <li>Діліться своїм досвідом про відчуття безпеки та єдності</li>
            <li>Робіть внесок у захист довкілля</li>
            <li>Знайомтесь з думкою спільноти</li>
          </ul>
        </div>

        <div class="space-y-2">
          <p>
            Як долучитися: Використовуйте інструменти на лівій панелі збоку, щоб позначати місця та ділитися своїм досвідом. Ваш внесок дозволить краще зрозуміти, в якому стані міський простір та як його покращити.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <template #footer>
        <div class="flex justify-end">
          <UButton color="gray" variant="solid" @click="closeModal">
            Close
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const closeModal = () => {
  isOpen.value = false
}
</script>
