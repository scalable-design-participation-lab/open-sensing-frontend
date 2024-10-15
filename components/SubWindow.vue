<template>
  <UCard class="bg-black text-white">
    <div class="space-y-4">
      <UProgress :value="progressPercentage" color="yellow" class="mb-4" />
      <div v-if="title || icon" class="flex items-center space-x-2">
        <UIcon v-if="icon" :name="icon" class="text-2xl text-white" />
        <h2 v-if="title" class="text-xl font-semibold text-white">
          {{ title }}
        </h2>
      </div>
      <p v-if="paragraph" class="text-sm text-gray-300">
        {{ paragraph }}
      </p>

      <UButton
        v-if="button"
        :color="button.color"
        class="w-full mb-2"
        @click="button.action"
      >
        {{ button.text }}
      </UButton>

      <div v-if="buttonGroup" class="space-y-2">
        <UButton
          v-for="btn in buttonGroup"
          :key="btn.text"
          :color="btn.color"
          variant="outline"
          :ui="{
            rounded: 'rounded-full',
            base: 'transition-all duration-300 ease-in-out transform hover:scale-105',
            padding: { sm: 'px-3 py-1.5', md: 'px-4 py-2', lg: 'px-5 py-2.5' },
            font: { weight: 'font-medium' },
            size: 'text-sm',
          }"
          :class="[
            'w-full mb-2',
            {
              'hover:bg-red-500 hover:text-white': btn.color === 'red',
              'hover:bg-green-500 hover:text-white': btn.color === 'green',
              'hover:bg-blue-500 hover:text-white': btn.color === 'blue',
              'hover:bg-yellow-500 hover:text-white': btn.color === 'yellow',
              'hover:bg-purple-500 hover:text-white': btn.color === 'purple',
            },
          ]"
          @click="btn.action"
        >
          {{ btn.text }}
        </UButton>
      </div>

      <div v-if="iconGrid" class="mt-4">
        <p class="text-sm text-gray-300 mb-2">{{ iconGrid.title }}</p>
        <UCard class="bg-white p-2">
          <div class="grid grid-cols-3 gap-3">
            <UButton
              v-for="icon in iconGrid.icons"
              :key="icon.name"
              variant="ghost"
              class="p-1 flex items-center justify-center"
              @click="iconGrid.onSelect(icon.name)"
            >
              <img
                :src="icon.src"
                :alt="icon.name"
                class="w-full h-full object-contain"
              />
            </UButton>
          </div>
        </UCard>
      </div>

      <slot></slot>

      <div class="flex justify-between mt-4">
        <UButton
          icon="i-heroicons-arrow-left-20-solid"
          color="white"
          variant="solid"
          :disabled="currentSubwindow === 1"
          @click="$emit('prev')"
        />
        <UButton
          icon="i-heroicons-arrow-right-20-solid"
          color="white"
          variant="solid"
          :disabled="currentSubwindow === maxSubwindow"
          @click="$emit('next')"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Button {
  text: string
  color: string
  action: () => void
}

interface IconGridItem {
  name: string
  src: string
}

interface IconGrid {
  title: string
  icons: IconGridItem[]
  onSelect: (iconName: string) => void
}

defineProps({
  currentSubwindow: {
    type: Number,
    required: true,
  },
  maxSubwindow: {
    type: Number,
    required: true,
  },
  progressPercentage: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  paragraph: {
    type: String,
    default: '',
  },
  button: {
    type: Object as () => Button,
    default: null,
  },
  buttonGroup: {
    type: Array as () => Button[],
    default: () => [],
  },
  iconGrid: {
    type: Object as () => IconGrid,
    default: null,
  },
})

defineEmits(['prev', 'next'])
</script>
