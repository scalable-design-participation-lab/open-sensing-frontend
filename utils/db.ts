// db.ts
import postgres from 'postgres'
import { logger } from './logger'

const sql = postgres({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

// Immediately verify connection:
;(async () => {
  try {
    await sql`SELECT 1` // tagged‐template => parameterized
    logger.info('Database connection established successfully')
  } catch (err) {
    logger.error('Failed to establish database connection:', err)
  }
})()

export default sql
