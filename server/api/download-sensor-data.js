import { defineEventHandler } from 'h3'
import pg from 'pg'
const { Pool } = pg

/**
 * API endpoint for downloading sensor data
 *
 * This endpoint allows clients to request specific sensor data within a given date range.
 * It connects to a PostgreSQL database, executes a query based on the provided parameters,
 * and returns the requested sensor data.
 *
 * @async
 * @function
 * @param {Object} event - The H3 event object
 * @returns {Promise<Array>} An array of sensor data objects
 * @throws {Error} 400 if the request body is invalid
 * @throws {Error} 500 if there's an internal server error
 *
 * @example
 * // Request body
 * {
 *   datasets: { temperature: true, humidity: true },
 *   dateRange: { start: '2023-01-01', end: '2023-01-31' }
 * }
 *
 * // Response
 * [
 *   { timestamp: '2023-01-01T00:00:00Z', temperature: 22.5, humidity: 45 },
 *   // ... more data points
 * ]
 */
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

    if (selectedDatasets.length === 0) {
      selectedDatasets.push('temperature')
    }

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

    try {
      const client = await pool.connect()
      const fallbackQuery =
        'SELECT timestamp, temperature FROM sen55 WHERE timestamp BETWEEN $1 AND $2'
      console.log('Executing fallback query:', fallbackQuery)
      const result = await client.query(fallbackQuery, [
        body.dateRange.start,
        body.dateRange.end,
      ])
      client.release()
      console.log(
        `Fallback query executed. Returned ${result.rows.length} rows.`
      )
      return result.rows
    } catch (fallbackErr) {
      console.error('Error executing fallback query', fallbackErr)
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
        data: {
          message: 'Failed to retrieve data, even with fallback query.',
          stack:
            process.env.NODE_ENV === 'development'
              ? fallbackErr.stack
              : undefined,
        },
      })
    }
  }
})
