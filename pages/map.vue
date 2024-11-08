<template>
  <div class="map-container">
    <GeneralizedHeader
      class="header-fixed"
      :left-items="leftItems"
      :right-items="rightItems"
      logo-src="/neu-logo.svg"
      logo-alt="Northeastern University Logo"
      :show-icon="true"
    />
    <div class="map-wrapper">
      <BackgroundMap :show-all-plus-icons="false" />
    </div>
    <GeneralizedFooter class="footer-fixed" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useMapUIStore } from '@/stores/mapUI'
import { useFirestore } from 'vuefire'
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
    label: 'Гуртомá',
    variant: 'solid',
    color: 'black',
  },
])

// Add right items for map controls
const currentMapType = ref('light')
const rightItems = ref([
  {
    icon: computed(() =>
      currentMapType.value === 'light'
        ? 'i-heroicons:map'
        : 'i-heroicons:globe-americas-20-solid',
    ),
    onClick: () => {
      currentMapType.value =
        currentMapType.value === 'light' ? 'satellite' : 'light'
      mapUIStore.setMapType(currentMapType.value)
    },
  },
])

onMounted(async () => {
  const projectsCollection = collection(db, 'projects')
  const querySnapshot = await getDocs(projectsCollection)

  for (const doc of querySnapshot.docs) {
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

    // Process space.recreational data (Polygons)
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

    // Process space.restricted data (LineStrings)
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
  }

  console.log('All features have been loaded')
})
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.footer-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.map-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
