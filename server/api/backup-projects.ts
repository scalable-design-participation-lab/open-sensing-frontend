import { defineEventHandler, readBody } from 'h3'
import * as fs from 'fs'
import * as path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { projects } = body

    // Create backups directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir)
    }

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `projects_backup_before_transform_${timestamp}.json`
    const filePath = path.join(backupDir, fileName)

    // Save data to file
    const backupData = {
      timestamp: new Date().toISOString(),
      projects,
    }

    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2))

    return {
      success: true,
      filePath,
      message: `Backup saved successfully at: ${filePath}`,
    }
  } catch (error) {
    console.error('Backup failed:', error)
    return {
      success: false,
      error: error.message,
    }
  }
})
