<template>
  <UCard
    v-if="isVisible"
    class="w-56 bg-black rounded-lg shadow-lg flex flex-col h-33"
  >
    <UTextarea
      v-model="localComment"
      placeholder="Напишіть коментар"
      class="flex-grow text-sm resize-none"
      @input="handleInput"
    />
    <div class="flex justify-between mt-2">
      <UButton
        color="gray"
        size="sm"
        variant="ghost"
        class="w-[48%] rounded-full flex justify-center"
        @click="closePopup"
      >
        Закрити
      </UButton>
      <UButton
        color="primary"
        size="sm"
        class="w-[48%] rounded-full flex justify-center"
        @click="addComment"
      >
        {{ existingComment ? 'Оновити' : 'Додати' }}
      </UButton>
    </div>
  </UCard>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useMapUIStore } from '../stores/mapUI'

const props = defineProps({
  isVisible: Boolean,
  featureId: Number,
})

const emit = defineEmits(['close'])

const mapUIStore = useMapUIStore()
const localComment = ref('')
const existingComment = ref('')

// Initialize when component mounts
onMounted(() => {
  if (props.featureId) {
    loadExistingComment()
  }
})

// Watch for featureId changes
watch(
  () => props.featureId,
  (newId) => {
    if (newId) {
      loadExistingComment()
    }
  },
)

// Watch for visibility changes
watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue && props.featureId) {
      loadExistingComment()
    }
  },
)

function loadExistingComment() {
  const comment = mapUIStore.getComment(props.featureId)
  existingComment.value = comment
  localComment.value = comment
}

function handleInput(event) {
  localComment.value = event.target.value
}

function addComment() {
  if (props.featureId !== null) {
    mapUIStore.addComment(props.featureId, localComment.value)
    existingComment.value = localComment.value
    closePopup()
  }
}

function closePopup() {
  emit('close')
}
</script>

<style scoped>
.u-textarea {
  min-height: 100px;
}
</style>
