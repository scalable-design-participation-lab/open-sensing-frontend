<template>
  <UCard class="bg-black/100 text-white">
    <div class="space-y-4">
      <UProgress
        :value="progressPercentage"
        :ui="{
          progress: {
            base: 'block appearance-none border-none overflow-hidden',
            bar: '[&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:ease-in-out [&::-moz-progress-bar]:rounded-full',
            background:
              '[&::-webkit-progress-value]:bg-[#B2FB4C] [&::-moz-progress-bar]:bg-[#B2FB4C]',
            track:
              '[&::-webkit-progress-bar]:bg-gray-700 [&::-webkit-progress-bar]:rounded-full [@supports(selector(&::-moz-progress-bar))]:bg-gray-700',
          },
        }"
        class="mb-4"
      />
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
            'w-full mb-2 text-center flex justify-center items-center !bg-black',
            {
              'border-2 border-red-500 !text-red-500 hover:!bg-white hover:!text-black':
                btn.color === 'red',
              'border-2 border-green-500 !text-green-500 hover:!bg-white hover:!text-black':
                btn.color === 'green',
              'border-2 border-blue-500 !text-blue-500 hover:!bg-white hover:!text-black':
                btn.color === 'blue',
              'border-2 border-[#B2FB4C] !text-[#B2FB4C] hover:!bg-white hover:!text-black':
                btn.color === '#B2FB4C',
              'border-2 border-purple-500 !text-purple-500 hover:!bg-white hover:!text-black':
                btn.color === 'purple',
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
