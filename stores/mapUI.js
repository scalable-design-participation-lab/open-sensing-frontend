import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import * as turf from '@turf/turf'

export const useMapUIStore = defineStore('mapUI', () => {
  const map = ref(null)
  const draw = ref(null)
  const markers = reactive([])
  const currentFrequency = ref(null)
  const calculatedArea = ref(0)
  const currentSubwindow = ref(1)
  const comment = ref('')

  const colors = {
    'every day': '#FF0000',
    'every week': '#00FF00',
    sometimes: '#0000FF',
    'only once': '#FFFF00',
    never: '#FF00FF',
  }

  function initializeMap(mapInstance, drawInstance) {
    if (map.value) return // 防止重复初始化

    map.value = mapInstance
    draw.value = drawInstance

    map.value.on('draw.create', handleDrawCreate)
    map.value.on('draw.delete', updateArea)
    map.value.on('draw.update', updateArea)
  }

  function activateDrawing(frequency) {
    if (draw.value) {
      currentFrequency.value = frequency
      draw.value.changeMode('draw_point')
    } else {
      console.error('Draw is not initialized')
    }
  }

  function handleDrawCreate(e) {
    try {
      if (e.features[0].geometry.type === 'Point' && currentFrequency.value) {
        const feature = e.features[0]
        const color = colors[currentFrequency.value]

        markers.push({
          id: feature.id,
          frequency: currentFrequency.value,
          color,
          coordinates: feature.geometry.coordinates,
        })

        renderMarker(feature.id, color, feature.geometry.coordinates)
        currentFrequency.value = null
      } else {
        updateArea(e)
      }
    } catch (error) {
      console.error('Error in handleDrawCreate:', error)
    }
  }

  function renderMarker(id, color, coordinates) {
    if (!map.value.getLayer(`point-${id}`)) {
      map.value.addLayer({
        id: `point-${id}`,
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: coordinates,
            },
          },
        },
        paint: {
          'circle-radius': 10,
          'circle-color': color,
        },
      })
    }
  }

  function updateArea(e) {
    try {
      const data = draw.value.getAll()
      if (data.features.length > 0) {
        const area = turf.area(data)
        calculatedArea.value = Math.round(area * 100) / 100
      } else {
        calculatedArea.value = 0
      }
    } catch (error) {
      console.error('Error in updateArea:', error)
    }
  }

  function activatePolygonDrawing() {
    if (draw.value) {
      draw.value.changeMode('draw_polygon')
    } else {
      console.error('Draw is not initialized')
    }
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

  return {
    map,
    draw,
    markers,
    calculatedArea,
    currentSubwindow,
    comment,
    initializeMap,
    activateDrawing,
    updateArea,
    activatePolygonDrawing,
    nextSubwindow,
    prevSubwindow,
    addComment,
  }
})
