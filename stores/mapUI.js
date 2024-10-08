import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

export const useMapUIStore = defineStore('mapUI', () => {
  const drawEnable = ref(true)
  const drawType = ref('Point')
  const currentFrequency = ref(null)
  const currentSubwindow = ref(1)
  const comment = ref('')
  const features = reactive([])
  const isCommentPopupOpen = ref(false)

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
    const feature = event.feature
    const frequency = feature.get('frequency') || 'every day'
    feature.set('frequency', frequency)
    console.log('Draw ended:', event)
    if (event.feature.getGeometry().getType() === 'Point') {
      const coordinates = event.feature.getGeometry().getCoordinates()
      features.push({
        id: Date.now(),
        type: 'Point',
        frequency: currentFrequency.value,
        coordinates: coordinates,
        comment: '',
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
      console.log('Current subwindow:', currentSubwindow.value)
    }
  }

  function prevSubwindow() {
    if (currentSubwindow.value > 1) {
      currentSubwindow.value--
    }
  }

  function addComment(pointId, newComment) {
    const feature = features.find((f) => f.id === pointId)
    if (feature) {
      feature.comment = newComment
    }
    console.log('Comment added:', newComment)
  }

  function getColorForFrequency(frequency) {
    return colors[frequency] || '#000000'
  }

  function addFeature(feature) {
    features.push({
      id: Date.now(),
      ...feature,
      comment: '',
      frequency: feature.type === 'Point' ? currentFrequency.value : null,
    })
    drawEnable.value = false
  }

  function setCommentPopupOpen(isOpen) {
    this.isCommentPopupOpen = isOpen
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
    addFeature,
    isCommentPopupOpen,
    setCommentPopupOpen,
  }
})
