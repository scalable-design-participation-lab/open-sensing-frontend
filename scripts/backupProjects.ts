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

function checkEnvironmentVariables() {
  const requiredEnvVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'FIREBASE_MEASUREMENT_ID',
  ]

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }
}

async function backupProjects() {
  try {
    checkEnvironmentVariables()

    console.log('Initializing Firebase app...')
    const app = initializeApp(firebaseConfig)

    console.log('Getting Firestore instance...')
    const db = getFirestore(app)

    console.log('Accessing projects collection...')
    const projectsCollection = collection(db, 'projects')

    console.log('Fetching documents...')
    const querySnapshot = await getDocs(projectsCollection)

    console.log(`Found ${querySnapshot.docs.length} documents`)

    const backupData = {
      timestamp: new Date().toISOString(),
      projects: querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      })),
    }

    const backupDir = path.join(__dirname, '../backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir)
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `projects_backup_${timestamp}.json`
    const filePath = path.join(backupDir, fileName)

    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2))

    console.log(`Backup completed successfully! File saved at: ${filePath}`)
    console.log(`Total documents backed up: ${backupData.projects.length}`)
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    })
    process.exit(1)
  }
}

backupProjects()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Backup script failed:', error)
    process.exit(1)
  })
