import { defineEventHandler, getQuery } from 'h3'
import db from '../../utils/db'

/**
 * API endpoint for retrieving sensor data by moduleId
 *
 * @async
 * @function
 * @param {Object} event - The H3 event object
 * @returns {Promise<Object>} Sensor data and location information
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const moduleId = query.moduleId

    if (!moduleId) {
      // Lastest readings for all modules
      const allSensorsQuery = await db.raw(`
        SELECT 
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
          s.timestamp,
          b.bme_temp,
          b.bme_humid,
          b.bme_pressure
        FROM modules m
        LEFT JOIN (
          SELECT s.*
          FROM sen55 s
          INNER JOIN (
            SELECT moduleid, MAX(timestamp) AS max_ts
            FROM sen55
            GROUP BY moduleid
          ) latest ON s.moduleid = latest.moduleid AND s.timestamp = latest.max_ts
        ) s ON m.moduleid = s.moduleid
        LEFT JOIN (
          SELECT b.*
          FROM bme_280 b
          INNER JOIN (
            SELECT moduleid, MAX(timestamp) AS max_ts
            FROM bme_280
            GROUP BY moduleid
          ) latest ON b.moduleid = latest.moduleid AND b.timestamp = latest.max_ts
        ) b ON m.moduleid = b.moduleid
        ORDER BY m.moduleid;
      `)

      return allSensorsQuery.rows
    }

    const locationQuery = await db.raw(
      `SELECT moduleid, ecohub_location, lat, lon FROM modules WHERE moduleid = ?`,
      [moduleId]
    )
    const moduleInfo = locationQuery.rows[0]

    if (!moduleInfo) {
      return { error: 'Module not found' }
    }

    const result = await db.raw(
      `
      SELECT 
        s.timestamp,
        s.temperature,
        s.relative_humidity,
        s.voc,
        s.nox,
        s.pm1,
        s.pm25,
        s.pm4,
        s.pm10,
        b.bme_humid,
        b.bme_temp,
        b.bme_pressure
      FROM sen55 s
      LEFT JOIN LATERAL (
        SELECT bme_humid, bme_temp, bme_pressure
        FROM bme_280 b
        WHERE b.moduleid = s.moduleid
        ORDER BY b.timestamp DESC
        LIMIT 1
      ) b ON true
      WHERE s.moduleid = ?
      ORDER BY s.timestamp DESC
      LIMIT 100
    `,
      [moduleId]
    )

    return {
      moduleInfo,
      sensorData: result.rows,
    }
  } catch (err) {
    console.error('Error executing query', err)
    return { error: 'Internal server error', details: err.message }
  }
})
