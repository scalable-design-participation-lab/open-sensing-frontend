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
  <div class="flex flex-col bg-white rounded-full py-3">
    <UButton
      v-for="(tool, index) in tools"
      :key="index"
      :class="[
        'w-12 h-12 my-1 rounded-full',
        'hover:translate-y-[-2px] hover:shadow-md hover:border hover:border-gray-200',
        'flex items-center justify-center',
      ]"
      color="white"
      variant="ghost"
      icon
      @click="handleToolClick(index)"
    >
      <UIcon
        :name="tool.icon"
        class="text-2xl text-gray-800 transform translate-y-[0.5px]"
      />
    </UButton>
  </div>
</template>

<script setup lang="ts">
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

const handleToolClick = (index: number) => {
  if (props.tools[index].action) {
    props.tools[index].action!()
  }
  emit('toolClick', index)
}
</script>
