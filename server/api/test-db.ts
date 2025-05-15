// server/api/db-test.ts
import { defineEventHandler, createError } from 'h3'
import sql from '../../utils/db'
import { logger } from '../../utils/logger'

export default defineEventHandler(async () => {
  logger.info('Starting database connection test')

  try {
    // 1) Ping the database
    logger.debug('Running SELECT 1…')
    await sql`SELECT 1`
    logger.info('Basic connection test successful')

    // 2) Fetch current timestamp
    const [{ current_time }] = await sql`SELECT NOW() AS current_time`
    logger.info('Database query successful', { current_time })

    return {
      status: 'success',
      message: 'Database connection is working',
      timestamp: current_time,
      database: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
      },
    }
  } catch (error: any) {
    logger.error('Database connection test failed:', error)

    const errorDetails = {
      message: error.message,
      code: error.code,
      // only include stack in dev
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Database connection failed',
      data: errorDetails,
    })
  }
})
