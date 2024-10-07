import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

export const useMapUIStore = defineStore('mapUI', () => {
  const drawEnable = ref(true)
  const drawType = ref('Point')
  const currentFrequency = ref(null)
  const currentSubwindow = ref(1)
  const comment = ref('')
  const features = reactive([])

  const colors = {
    'every day': '#FF0000',
    'every week': '#00FF00',
    sometimes: '#0000FF',
    'only once': '#FFFF00',
    never: '#FF00FF',
  }

  const currentColor = computed(
    () => colors[currentFrequency.value] || '#000000'
  )

  function activateDrawing(frequency) {
    currentFrequency.value = frequency
    drawType.value = 'Point'
    drawEnable.value = true
  }

  function handleDrawStart(event) {
    console.log('Draw started:', event)
  }

  function handleDrawEnd(event) {
    console.log('Draw ended:', event)
    if (event.feature.getGeometry().getType() === 'Point') {
      const coordinates = event.feature.getGeometry().getCoordinates()
      features.push({
        id: Date.now(),
        type: 'Point',
        frequency: currentFrequency.value,
        coordinates: coordinates,
      })
    } else if (event.feature.getGeometry().getType() === 'Polygon') {
      const coordinates = event.feature.getGeometry().getCoordinates()
      features.push({
        id: Date.now(),
        type: 'Polygon',
        coordinates: coordinates,
      })
    }
    currentFrequency.value = null
    drawEnable.value = false
  }

  function activatePolygonDrawing() {
    drawType.value = 'Polygon'
    drawEnable.value = true
  }

  function nextSubwindow() {
    if (currentSubwindow.value < 4) {
      currentSubwindow.value++
    }
  }

  function prevSubwindow() {
    if (currentSubwindow.value > 1) {
      currentSubwindow.value--
    }
  }

  function addComment() {
    console.log('Comment added:', comment.value)
    comment.value = ''
  }

  function getColorForFrequency(frequency) {
    return colors[frequency] || '#000000'
  }

  return {
    drawEnable,
    drawType,
    currentFrequency,
    currentSubwindow,
    comment,
    features,
    currentColor,
    activateDrawing,
    handleDrawStart,
    handleDrawEnd,
    activatePolygonDrawing,
    nextSubwindow,
    prevSubwindow,
    addComment,
    getColorForFrequency,
  }
})
