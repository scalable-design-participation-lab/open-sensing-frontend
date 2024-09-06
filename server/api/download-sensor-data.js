import { defineEventHandler } from 'h3'
import pg from 'pg'
const { Pool } = pg

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  console.log('Received request body:', body)

  if (!body || !body.datasets || !body.dateRange) {
    console.error('Invalid request body:', body)
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'Invalid request body. Missing datasets or dateRange.',
      },
    })
  }

  const pool = new Pool({
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    password: config.dbPassword,
    port: config.dbPort,
  })

  try {
    console.log('Connecting to database for download...')
    const client = await pool.connect()

    let query = 'SELECT timestamp'
    const selectedDatasets = Object.keys(body.datasets).filter(
      (key) => body.datasets[key]
    )
    selectedDatasets.forEach((dataset) => {
      query += `, ${dataset}`
    })
    query += ' FROM sen55 WHERE timestamp BETWEEN $1 AND $2'

    console.log('Executing query:', query)
    console.log('Query parameters:', [body.dateRange.start, body.dateRange.end])

    const result = await client.query(query, [
      body.dateRange.start,
      body.dateRange.end,
    ])
    client.release()
    console.log(`Query executed. Returned ${result.rows.length} rows.`)

    return result.rows
  } catch (err) {
    console.error('Error executing query for download', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
      data: {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      },
    })
  }
})
