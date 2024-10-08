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

  const currentColor = computed(() => {
    if (drawType.value === 'Point') {
      return colors[currentFrequency.value] || '#000000'
    } else if (drawType.value === 'Polygon') {
      return 'black'
    } else if (drawType.value === 'LineString') {
      return 'red'
    }
    return 'black'
  })

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
    const geometryType = feature.getGeometry().getType()

    if (geometryType === 'LineString') {
      const coordinates = feature.getGeometry().getCoordinates()
      features.push({
        id: Date.now(),
        type: 'LineString',
        coordinates: coordinates,
        comment: '',
      })
    } else if (geometryType === 'Point') {
      const coordinates = feature.getGeometry().getCoordinates()
      features.push({
        id: Date.now(),
        type: 'Point',
        coordinates: coordinates,
        frequency: currentFrequency.value,
        comment: '',
      })
    } else if (geometryType === 'Polygon') {
      const coordinates = feature.getGeometry().getCoordinates()
      features.push({
        id: Date.now(),
        type: 'Polygon',
        coordinates: coordinates,
        comment: '',
      })
    }

    drawEnable.value = false
  }

  function activatePolygonDrawing() {
    drawType.value = 'Polygon'
    drawEnable.value = true
    currentFrequency.value = null
  }

  function activateLineStringDrawing() {
    drawType.value = 'LineString'
    drawEnable.value = true
    currentFrequency.value = null
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
    activateLineStringDrawing,
    nextSubwindow,
    prevSubwindow,
    addComment,
    getColorForFrequency,
    addFeature,
    isCommentPopupOpen,
    setCommentPopupOpen,
  }
})
