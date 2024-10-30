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

    // If no moduleId is provided, return all sensors basic info
    if (!moduleId) {
      const allSensorsQuery = await db.raw(`
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
        ) s ON m.moduleid = s.moduleid
        ORDER BY m.moduleid
      `)

      return allSensorsQuery.rows
    }

    // First get the module location info
    const locationQuery = await db.raw(
      `
      SELECT moduleid, ecohub_location, lat, lon
      FROM modules
      WHERE moduleid = ?
    `,
      [moduleId]
    )

    const moduleInfo = locationQuery.rows[0]

    if (!moduleInfo) {
      return { error: 'Module not found' }
    }

    // Then get the sensor data
    const result = await db.raw(
      `
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
      WHERE moduleid = ?
      ORDER BY timestamp DESC
    `,
      [moduleId]
    )

    console.log(
      `Query executed. Returned ${result.rows.length} rows for module ${moduleId}`
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
