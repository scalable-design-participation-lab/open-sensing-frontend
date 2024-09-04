<template>
  <div class="flex flex-col bg-white/90 rounded-3xl p-4 shadow-lg z-[1000]">
    <UButton
      v-for="(tool, index) in tools"
      :key="index"
      :class="[
        'w-14 h-14 my-2 rounded-full transition-all duration-300 ease-in-out bg-white',
        'hover:translate-y-[-2px] hover:shadow-md hover:bg-gray-100',
        'flex items-center justify-center',
        { 'bg-blue-500 text-white': activeToolIndex === index },
      ]"
      color="white"
      variant="ghost"
      icon
      @click="handleToolClick(index)"
    >
      <UIcon
        :name="tool.icon"
        class="text-2xl text-gray-800"
        :class="[
          { 'text-white': activeToolIndex === index },
          'transform translate-y-[0.5px]',
        ]"
      />
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Tool {
  icon: string
  tooltip: string
  action?: () => void
}

const props = defineProps<{
  tools: Tool[]
}>()

const emit = defineEmits<{
  (e: 'toolClick', index: number): void
}>()

const activeToolIndex = ref<number | null>(null)

const handleToolClick = (index: number) => {
  activeToolIndex.value = activeToolIndex.value === index ? null : index
  if (props.tools[index].action) {
    props.tools[index].action!()
  }
  emit('toolClick', index)
}
</script>
