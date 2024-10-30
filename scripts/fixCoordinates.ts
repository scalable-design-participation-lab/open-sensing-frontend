import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore'
import * as fs from 'fs'
import * as path from 'path'
import * as maptilerClient from '@maptiler/client'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

// Initialize MapTiler client
maptilerClient.config.apiKey = 'MXvVeD31i6q1RC6ihyrD'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface Point {
  lon: number
  lat: number
  comment?: string
  timestamp?: string
}

interface ProjectData {
  space: {
    [key: string]: Point[]
  }
  belonging: {
    [key: string]: Point[]
  }
  safety: {
    [key: string]: Point[]
  }
  environment: {
    [key: string]: Point[]
  }
}

interface BackupDoc {
  id: string
  data: ProjectData
}

interface TransformResult {
  results: Array<{
    x: number
    y: number
  }>
}

async function transformCoordinates([lon, lat]: [number, number]): Promise<
  [number, number]
> {
  try {
    const result = (await maptilerClient.coordinates.transform([lon, lat], {
      sourceCrs: 4326,
      targetCrs: 3857,
    })) as TransformResult

    if (!result.results?.[0]?.x || !result.results?.[0]?.y) {
      throw new Error('Invalid transform result')
    }

    return [result.results[0].x, result.results[0].y]
  } catch (error) {
    console.error('Coordinate transformation failed:', error)
    return [lon, lat]
  }
}

async function fixCoordinates() {
  try {
    const backupDir = path.join(__dirname, '../backups')
    const backupFiles = fs.readdirSync(backupDir)
    const latestBackup = backupFiles
      .filter((f) => f.startsWith('projects_backup_before_transform'))
      .sort()
      .pop()

    if (!latestBackup) {
      throw new Error('No backup file found')
    }

    const backupData = JSON.parse(
      fs.readFileSync(path.join(backupDir, latestBackup), 'utf-8'),
    )

    const validationFiles = backupFiles
      .filter((f) => f.startsWith('validation_results'))
      .sort()
      .pop()

    if (!validationFiles) {
      throw new Error('No validation results found')
    }

    const validationResults = JSON.parse(
      fs.readFileSync(path.join(backupDir, validationFiles), 'utf-8'),
    )
    for (const result of validationResults) {
      const backupDoc = backupData.projects.find(
        (d: BackupDoc) => d.id === result.id,
      )
      if (!backupDoc) continue

      const updates: Record<string, Point[]> = {}

      for (const invalid of result.invalidCoordinates) {
        const [category, type, index] = invalid.path
          .split(/[.[\]]/)
          .filter(Boolean)
        const originalPoint = backupDoc.data[category][type][parseInt(index)]
        if (!originalPoint) continue

        const [newLon, newLat] = await transformCoordinates([
          originalPoint.lon,
          originalPoint.lat,
        ])

        if (!updates[`${category}.${type}`]) {
          updates[`${category}.${type}`] = await Promise.all(
            backupDoc.data[category][type].map(
              async (point: Point, i: number) => {
                if (i === parseInt(index)) {
                  return {
                    ...point,
                    lon: newLon,
                    lat: newLat,
                  }
                }
                return point
              },
            ),
          )
        }
      }

      try {
        const docRef = doc(db, 'projects', result.id)
        await updateDoc(docRef, updates)
        console.log(`Successfully fixed coordinates for project: ${result.id}`)
      } catch (error) {
        console.error(`Failed to update project ${result.id}:`, error)
      }
    }

    console.log('All coordinates have been fixed')
  } catch (error) {
    console.error('Fix failed:', error)
  }
}

fixCoordinates()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
