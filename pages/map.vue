<template>
  <BackgroundMap :show-all-plus-icons="true" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'
import { useFirestore, useCollection } from 'vuefire'
import { collection, getDocs } from 'firebase/firestore'

const mapUIStore = useMapUIStore()
const db = useFirestore()

onMounted(async () => {
  const projectsCollection = collection(db, 'projects')
  const querySnapshot = await getDocs(projectsCollection)

  querySnapshot.forEach((doc) => {
    const projectData = doc.data()

    // Process space.visited data
    Object.keys(projectData.space).forEach((frequency) => {
      projectData.space[frequency].forEach((point) => {
        mapUIStore.addFeature({
          type: 'Point',
          coordinates: [point.lon, point.lat],
          frequency: frequency,
          comment: point.comment,
        })
      })
    })

    // Process space.recreational data
    projectData.space.recreational.forEach((polygon) => {
      mapUIStore.addFeature({
        type: 'Polygon',
        coordinates: JSON.parse(polygon.geometry),
        comment: polygon.comment,
      })
    })

    // Process space.restricted data
    projectData.space.restricted.forEach((lineString) => {
      mapUIStore.addFeature({
        type: 'LineString',
        coordinates: JSON.parse(lineString.geometry),
        comment: lineString.comment,
      })
    })

    // Process belonging data
    Object.keys(projectData.belonging).forEach((key) => {
      projectData.belonging[key].forEach((point) => {
        mapUIStore.addFeature({
          type: 'Point',
          coordinates: [point.lon, point.lat],
          iconName: key,
          comment: point.comment,
        })
      })
    })

    // Process safety data
    Object.keys(projectData.safety).forEach((key) => {
      projectData.safety[key].forEach((point) => {
        mapUIStore.addFeature({
          type: 'Point',
          coordinates: [point.lon, point.lat],
          iconName: key,
          comment: point.comment,
        })
      })
    })

    // Process environment data
    Object.keys(projectData.environment).forEach((key) => {
      projectData.environment[key].forEach((point) => {
        mapUIStore.addFeature({
          type: 'Point',
          coordinates: [point.lon, point.lat],
          iconName: key,
          comment: point.comment,
        })
      })
    })
  })
})
</script>
