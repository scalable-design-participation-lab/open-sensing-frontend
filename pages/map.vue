<template>
  <GeneralizedHeader
    class="z-20"
    :left-items="leftItems"
    logo-src="/neu-logo.svg"
    logo-alt="Northeastern University Logo"
    :show-icon="true"
  />
  <GeneralizedFooter />
  <BackgroundMap :show-all-plus-icons="false" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'
import { useFirestore, useCollection } from 'vuefire'
import { collection, getDocs } from 'firebase/firestore'

const mapUIStore = useMapUIStore()
const db = useFirestore()

const leftItems = ref([
  {
    label: 'Drawing Participation',
    variant: 'solid',
    color: 'black',
  },
  {
    label: 'Restart Ukraine',
    variant: 'solid',
    color: 'black',
  },
])

onMounted(async () => {
  const projectsCollection = collection(db, 'projects')
  const querySnapshot = await getDocs(projectsCollection)

  querySnapshot.forEach((doc) => {
    const projectData = doc.data()

    // Process space data
    Object.keys(projectData.space).forEach((frequency) => {
      if (Array.isArray(projectData.space[frequency])) {
        projectData.space[frequency].forEach((point) => {
          mapUIStore.addFeature({
            type: 'Point',
            coordinates: [point.lon, point.lat],
            frequency: frequency,
            comment: point.comment,
            name: projectData.name,
            timestamp: point.timestamp,
          })
        })
      }
    })

    // Process space.recreational data
    if (Array.isArray(projectData.space.recreational)) {
      projectData.space.recreational.forEach((polygon) => {
        mapUIStore.addFeature({
          type: 'Polygon',
          coordinates: JSON.parse(polygon.geometry),
          comment: polygon.comment,
          name: projectData.name,
          timestamp: polygon.timestamp,
        })
      })
    }

    // Process space.restricted data
    if (Array.isArray(projectData.space.restricted)) {
      projectData.space.restricted.forEach((lineString) => {
        mapUIStore.addFeature({
          type: 'LineString',
          coordinates: JSON.parse(lineString.geometry),
          comment: lineString.comment,
          name: projectData.name,
          timestamp: lineString.timestamp,
        })
      })
    }

    // Process belonging data
    Object.keys(projectData.belonging).forEach((key) => {
      if (Array.isArray(projectData.belonging[key])) {
        projectData.belonging[key].forEach((point) => {
          mapUIStore.addFeature({
            type: 'Point',
            coordinates: [point.lon, point.lat],
            iconName: key,
            comment: point.comment,
            name: projectData.name,
            timestamp: point.timestamp,
          })
        })
      }
    })

    // Process safety data
    Object.keys(projectData.safety).forEach((key) => {
      if (Array.isArray(projectData.safety[key])) {
        projectData.safety[key].forEach((point) => {
          mapUIStore.addFeature({
            type: 'Point',
            coordinates: [point.lon, point.lat],
            iconName: key,
            comment: point.comment,
            name: projectData.name,
            timestamp: point.timestamp,
          })
        })
      }
    })

    // Process environment data
    Object.keys(projectData.environment).forEach((key) => {
      if (Array.isArray(projectData.environment[key])) {
        projectData.environment[key].forEach((point) => {
          mapUIStore.addFeature({
            type: 'Point',
            coordinates: [point.lon, point.lat],
            iconName: key,
            comment: point.comment,
            name: projectData.name,
            timestamp: point.timestamp,
          })
        })
      }
    })
  })
})
</script>
