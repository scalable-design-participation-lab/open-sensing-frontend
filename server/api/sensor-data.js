import { defineEventHandler } from 'h3'
import pg from 'pg'
const { Pool } = pg

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const pool = new Pool({
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    password: config.dbPassword,
    port: config.dbPort,
  })

  try {
    console.log('Attempting to connect to database...')
    const client = await pool.connect()
    console.log('Connected to database. Executing query...')

    const query = `
      SELECT 
        timestamp,
        temperature,
        relative_humidity,
        voc,
        nox,
        pm1,
        pm25,
        pm4,
        pm10
      FROM sen55
      WHERE 
        temperature != 0 OR
        relative_humidity != 0 OR
        voc != 0 OR
        nox != 0 OR
        pm1 != 0 OR
        pm25 != 0 OR
        pm4 != 0 OR
        pm10 != 0
      ORDER BY timestamp DESC
      LIMIT 1000
    `

    const result = await client.query(query)
    client.release()
    console.log(`Query executed. Returned ${result.rows.length} rows.`)

    return result.rows
  } catch (err) {
    console.error('Error executing query', err)
    return { error: 'Internal server error', details: err.message }
  }
})
