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
        const result = await client.query('SELECT * FROM sen55 ORDER BY timestamp')
        client.release()
        console.log(`Query executed. Returned ${result.rows.length} rows.`)

        return result.rows
    } catch (err) {
        console.error('Error executing query', err)
        return { error: 'Internal server error' }
    }
})
