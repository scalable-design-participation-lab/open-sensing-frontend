<!--
 * GenericToolbar Component
 *
 * This component renders a vertical toolbar with customizable tool buttons.
 * Each tool is represented by an icon and can have an associated action.
 * The toolbar supports visual feedback for the active tool and hover effects.
 *
 * @component
 * @example
 * <GenericToolbar :tools="toolbarItems" @tool-click="handleToolSelection" />
 -->

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

/**
 * Represents a tool in the toolbar
 * @typedef {Object} Tool
 * @property {string} icon - The icon name for the tool
 * @property {string} tooltip - The tooltip text for the tool
 * @property {Function} [action] - Optional action to be executed when the tool is clicked
 */

/**
 * @type {import('vue').PropType<Tool[]>}
 */
const props = defineProps<{
  tools: Tool[]
}>()

/**
 * Emits the index of the clicked tool
 * @type {(e: 'toolClick', index: number) => void}
 */
const emit = defineEmits<{
  (e: 'toolClick', index: number): void
}>()

/**
 * Tracks the index of the currently active tool
 * @type {import('vue').Ref<number | null>}
 */
const activeToolIndex = ref<number | null>(null)

/**
 * Handles the click event on a tool
 * @param {number} index - The index of the clicked tool
 */
const handleToolClick = (index: number) => {
  activeToolIndex.value = activeToolIndex.value === index ? null : index
  if (props.tools[index].action) {
    props.tools[index].action!()
  }
  emit('toolClick', index)
}
</script>
