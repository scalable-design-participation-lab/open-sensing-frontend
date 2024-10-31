import { defineEventHandler, getQuery } from 'h3'
import { usePostgres } from '../../utils/postgres'

export default defineEventHandler(async (event) => {
  try {
    const sql = usePostgres()
    const query = getQuery(event)
    const moduleId = query.moduleId

    // If no moduleId is provided, return all sensors basic info
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
        ) s ON m.moduleid = s.moduleid
        ORDER BY m.moduleid
      `

      // Ensure connection is closed
      event.waitUntil(sql.end())
      return allSensors
    }

    // Get module location info
    const moduleInfo = await sql`
      SELECT moduleid, ecohub_location, lat, lon
      FROM modules
      WHERE moduleid = ${moduleId}
    `

    if (!moduleInfo?.[0]) {
      await sql.end()
      return { error: 'Module not found' }
    }

    // Get sensor data
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

    console.log(
      `Query executed. Returned ${sensorData.length} rows for module ${moduleId}`
    )

    // Ensure connection is closed
    event.waitUntil(sql.end())

    return {
      moduleInfo: moduleInfo[0],
      sensorData,
    }
  } catch (err) {
    console.error('Error executing query', err)
    return { error: 'Internal server error', details: err.message }
  }
})
