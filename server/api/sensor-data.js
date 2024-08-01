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
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM sen55 ORDER BY timestamp')
        client.release()

        return result.rows
    } catch (err) {
        console.error('Error executing query', err)
        return { error: 'Internal server error' }
    }
})
