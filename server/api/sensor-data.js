// server/api/get-sensor-data.ts
import { defineEventHandler, getQuery, createError } from 'h3'
import getDb from '../../utils/db'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  const sql = await getDb()
  try {
    const { moduleId } = getQuery(event)
    logger.info('Fetching sensor data for moduleId:', moduleId ?? 'ALL')

    // 1) If no moduleId, return all modules with latest SEN55 reading
    if (!moduleId) {
      const allSensors = await sql`
        SELECT DISTINCT
          m.moduleid,
          m.ecohub_location,
          m.lat,
          m.lon,
          s.temperature,
          s.relative_humidity,
          s.voc,
          s.nox,
          s.pm1,
          s.pm25,
          s.pm4,
          s.pm10,
          s.timestamp
        FROM modules m
        LEFT JOIN (
          SELECT DISTINCT ON (moduleid)
            moduleid,
            temperature,
            relative_humidity,
            voc,
            nox,
            pm1,
            pm25,
            pm4,
            pm10,
            timestamp
          FROM sen55
          ORDER BY moduleid, timestamp DESC
        ) AS s
          ON m.moduleid = s.moduleid
        ORDER BY m.moduleid
      `
      return allSensors
    }

    // 2) Fetch module metadata
    const moduleRows = await sql`
      SELECT moduleid, ecohub_location, lat, lon
      FROM modules
      WHERE moduleid = ${moduleId}
    `
    if (moduleRows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Module not found' })
    }
    const moduleInfo = moduleRows[0]

    // 3) Fetch full sensor history for that module
    const sensorData = await sql`
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
      WHERE moduleid = ${moduleId}
      ORDER BY timestamp DESC
    `
    logger.debug(`Returned ${sensorData.length} rows for module ${moduleId}`)

    return { moduleInfo, sensorData }
  } catch (err) {
    logger.error('Error executing query', err)
    throw createError({
      statusCode: err.statusCode ?? 500,
      statusMessage: err.statusMessage ?? 'Internal server error',
      data: { message: err.message },
    })
  }
})
