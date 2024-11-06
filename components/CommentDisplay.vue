<template>
  <ol-overlay v-if="isOpen" :position="getDisplayPosition" :offset="[30, 0]">
    <UCard class="min-w-[200px] max-w-[300px] shadow-lg">
      <template #header>
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium">
              {{ getFeatureTitle(feature) }}
            </h3>
            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              size="xs"
              @click="closeModal"
            />
          </div>

          <div v-if="feature?.name" class="text-xs text-gray-500">
            Added by: {{ feature.name.firstname }} {{ feature.name.lastname }}
          </div>
        </div>
      </template>

      <div class="p-2 space-y-2">
        <div class="space-y-1">
          <p v-if="feature?.comment?.length > 0" class="text-sm text-gray-700">
            {{ feature.comment }}
          </p>
          <p v-else class="text-sm text-gray-500 italic">
            No comment available for this location
          </p>
        </div>

        <div v-if="feature?.timestamp" class="text-xs text-gray-500">
          Added on: {{ formatDate(feature.timestamp) }}
        </div>
      </div>
    </UCard>
  </ol-overlay>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'

interface Name {
  firstname: string
  lastname: string
}

interface Feature {
  id?: string
  type: string
  coordinates: number[]
  comment?: string
  iconName?: string
  frequency?: string
  name?: Name
  timestamp?: string
}

const props = defineProps<{
  modelValue: boolean
  feature: Feature | null
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function formatDate(timestamp: string): string {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getFeatureTitle(feature: Feature | null) {
  if (!feature) return 'Location Details'

  if (feature.iconName) {
    // Convert iconName to display name
    const iconDisplayNames = {
      pollution: 'Pollution Point',
      leaf: 'Green Space',
      'flora-fauna': 'Flora & Fauna',
      lock: 'Safe Area',
      great: 'Very Safe Area',
      calm: 'Calm Area',
      safe: 'Safe Zone',
      broken: 'Unsafe Area',
      unsafe: 'Danger Zone',
      dislike: 'Dislike',
      negative: 'Negative',
      heart: 'Favorite',
      love: 'Loved Place',
      smile: 'Happy Place',
      positive: 'Positive',
    }
    return iconDisplayNames[feature.iconName] || 'Location'
  } else if (feature.frequency) {
    // Convert frequency to display name
    const frequencyDisplayNames = {
      'every day': 'Daily Visit',
      everyday: 'Daily Visit',
      'every week': 'Weekly Visit',
      everyweek: 'Weekly Visit',
      sometimes: 'Occasional Visit',
      'only once': 'One-time Visit',
      once: 'One-time Visit',
      never: 'Never Visited',
    }
    return frequencyDisplayNames[feature.frequency] || 'Location'
  }

  return 'Location Details'
}

const closeModal = () => {
  isOpen.value = false
}

// Add watchers for debugging
watch(
  () => props.modelValue,
  (newValue) => {},
  { immediate: true },
)

watch(
  () => props.feature,
  (newValue) => {},
)

// Add computed property for position
const getDisplayPosition = computed(() => {
  if (!props.feature) return [0, 0]

  switch (props.feature.type) {
    case 'Point':
      return props.feature.coordinates
    case 'Polygon':
      // Calculate center of polygon
      const polygonCoords = props.feature.coordinates[0] as number[][]
      const sumX = polygonCoords.reduce((sum, coord) => sum + coord[0], 0)
      const sumY = polygonCoords.reduce((sum, coord) => sum + coord[1], 0)
      return [sumX / polygonCoords.length, sumY / polygonCoords.length]
    case 'LineString':
      // Use the start point (where the prohibit icon is)
      return props.feature.coordinates[0]
    default:
      return [0, 0]
  }
})
</script>

<style scoped>
.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.space-y-1 > * + * {
  margin-top: 0.25rem;
}
</style>
