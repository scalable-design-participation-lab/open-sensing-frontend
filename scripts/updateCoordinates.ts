import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import * as maptilerClient from '@maptiler/client'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  // authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

maptilerClient.config.apiKey = 'MXvVeD31i6q1RC6ihyrD'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function transformCoordinates([lon, lat]: [number, number]): Promise<
  [number, number]
> {
  try {
    const result = await maptilerClient.coordinates.transform([lon, lat], {
      sourceCrs: 4326,
      targetCrs: 3857,
    })
    return [result.results[0].x, result.results[0].y]
  } catch (error) {
    console.error('Coordinate transformation failed:', error)
    return [lon, lat]
  }
}

async function updateProjectCoordinates() {
  const projectsCollection = collection(db, 'projects')
  const querySnapshot = await getDocs(projectsCollection)

  for (const doc of querySnapshot.docs) {
    const projectData = doc.data()
    const updates: any = {}

    for (const frequency in projectData.space) {
      if (Array.isArray(projectData.space[frequency])) {
        const updatedPoints = await Promise.all(
          projectData.space[frequency].map(async (point: any) => {
            const [newLon, newLat] = await transformCoordinates([
              point.lon,
              point.lat,
            ])
            return {
              ...point,
              lon: newLon,
              lat: newLat,
            }
          }),
        )
        updates[`space.${frequency}`] = updatedPoints
      }
    }

    if (Array.isArray(projectData.space.recreational)) {
      const updatedPolygons = await Promise.all(
        projectData.space.recreational.map(async (polygon: any) => {
          const geometry = JSON.parse(polygon.geometry)
          const transformedGeometry = await Promise.all(
            geometry.map(async (ring: [number, number][]) => {
              return await Promise.all(
                ring.map((coord) => transformCoordinates(coord)),
              )
            }),
          )
          return {
            ...polygon,
            geometry: JSON.stringify(transformedGeometry),
          }
        }),
      )
      updates['space.recreational'] = updatedPolygons
    }

    if (Array.isArray(projectData.space.restricted)) {
      const updatedLines = await Promise.all(
        projectData.space.restricted.map(async (line: any) => {
          const geometry = JSON.parse(line.geometry)
          const transformedGeometry = await Promise.all(
            geometry.map((coord) => transformCoordinates(coord)),
          )
          return {
            ...line,
            geometry: JSON.stringify(transformedGeometry),
          }
        }),
      )
      updates['space.restricted'] = updatedLines
    }

    for (const category of ['belonging', 'safety', 'environment']) {
      for (const key in projectData[category]) {
        if (Array.isArray(projectData[category][key])) {
          const updatedPoints = await Promise.all(
            projectData[category][key].map(async (point: any) => {
              const [newLon, newLat] = await transformCoordinates([
                point.lon,
                point.lat,
              ])
              return {
                ...point,
                lon: newLon,
                lat: newLat,
              }
            }),
          )
          updates[`${category}.${key}`] = updatedPoints
        }
      }
    }

    try {
      await updateDoc(doc.ref, updates)
      console.log(`Successfully updated coordinates for project: ${doc.id}`)
    } catch (error) {
      console.error(`Failed to update project ${doc.id}:`, error)
    }
  }
}

updateProjectCoordinates()
  .then(() => {
    console.log('Coordinate update completed')
  })
  .catch((error) => {
    console.error('Update failed:', error)
  })
