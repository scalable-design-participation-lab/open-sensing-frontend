import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import * as fs from 'fs'
import * as path from 'path'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

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

interface ValidationResult {
  id: string
  invalidCoordinates: Array<{
    type: string
    path: string
    coordinates: {
      lon: number | null
      lat: number | null
    }
    reason: string
  }>
}

async function validateCoordinates() {
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

    const projectsCollection = collection(db, 'projects')
    const querySnapshot = await getDocs(projectsCollection)
    const currentData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data() as ProjectData,
    }))

    const validationResults: ValidationResult[] = []

    for (const currentDoc of currentData) {
      const backupDoc = backupData.projects.find(
        (d: BackupDoc) => d.id === currentDoc.id,
      )
      if (!backupDoc) continue

      const invalidCoordinates: ValidationResult['invalidCoordinates'] = []

      const validatePoint = (current: Point, backup: Point, path: string) => {
        if (!current || !backup) return

        if (current.lon === null || current.lat === null) {
          invalidCoordinates.push({
            type: 'point',
            path,
            coordinates: { lon: current.lon, lat: current.lat },
            reason: 'Coordinates are null',
          })
        }

        if (
          Math.abs(current.lon) > 20037508.34 ||
          Math.abs(current.lat) > 20037508.34
        ) {
          invalidCoordinates.push({
            type: 'point',
            path,
            coordinates: { lon: current.lon, lat: current.lat },
            reason: 'Coordinates out of EPSG:3857 bounds',
          })
        }
      }

      const spaceTypes = ['everyday', 'everyweek', 'sometimes', 'once', 'never']
      for (const type of spaceTypes) {
        const currentPoints = currentDoc.data.space[type] || []
        const backupPoints = backupDoc.data.space[type] || []

        currentPoints.forEach((point: Point, index: number) => {
          validatePoint(point, backupPoints[index], `space.${type}[${index}]`)
        })
      }

      const belongingTypes = ['positive', 'negative', 'love']
      for (const type of belongingTypes) {
        const currentPoints = currentDoc.data.belonging[type] || []
        const backupPoints = backupDoc.data.belonging[type] || []

        currentPoints.forEach((point: Point, index: number) => {
          validatePoint(
            point,
            backupPoints[index],
            `belonging.${type}[${index}]`,
          )
        })
      }

      const safetyTypes = ['safe', 'unsafe', 'great']
      for (const type of safetyTypes) {
        const currentPoints = currentDoc.data.safety[type] || []
        const backupPoints = backupDoc.data.safety[type] || []

        currentPoints.forEach((point: Point, index: number) => {
          validatePoint(point, backupPoints[index], `safety.${type}[${index}]`)
        })
      }

      const envTypes = ['pollution', 'flora-fauna']
      for (const type of envTypes) {
        const currentPoints = currentDoc.data.environment[type] || []
        const backupPoints = backupDoc.data.environment[type] || []

        currentPoints.forEach((point: Point, index: number) => {
          validatePoint(
            point,
            backupPoints[index],
            `environment.${type}[${index}]`,
          )
        })
      }

      if (invalidCoordinates.length > 0) {
        validationResults.push({
          id: currentDoc.id,
          invalidCoordinates,
        })
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const resultPath = path.join(
      backupDir,
      `validation_results_${timestamp}.json`,
    )
    fs.writeFileSync(resultPath, JSON.stringify(validationResults, null, 2))

    console.log(
      `Validation completed. Found ${validationResults.length} documents with issues`,
    )
    console.log(`Results saved to: ${resultPath}`)
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

validateCoordinates()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
