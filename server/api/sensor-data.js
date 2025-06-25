import { defineEventHandler, getQuery } from 'h3'
import db from '../../utils/db'
import { subMonths } from 'date-fns'

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
    const { moduleId, start, end } = getQuery(event)
    const startDate = start ? new Date(start) : subMonths(new Date(), 1)
    const endDate = end ? new Date(end) : new Date()

    if (!moduleId) {
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

    // === DYNAMIC QUERY SECTION ===

    const locationQuery = await db.raw(
      `SELECT moduleid, ecohub_location, lat, lon FROM modules WHERE moduleid = ?`,
      [moduleId]
    )
    const moduleInfo = locationQuery.rows[0]
    if (!moduleInfo) return { error: 'Module not found' }

    const sensorListQuery = await db.raw(
      `SELECT sensors FROM modulesensors WHERE moduleid = ?`,
      [moduleId]
    )
    const sensors = sensorListQuery.rows[0]?.sensors ?? []
    const validSensors = ['bme_280', 'scd_41']
    const filteredSensors = sensors.filter((s) => validSensors.includes(s))

    const baseTable = 'sen55'
    const baseAlias = 's'

    const selectFields = [
      `${baseAlias}.timestamp`,
      `${baseAlias}.temperature`,
      `${baseAlias}.relative_humidity`,
      `${baseAlias}.voc`,
      `${baseAlias}.nox`,
      `${baseAlias}.pm1`,
      `${baseAlias}.pm25`,
      `${baseAlias}.pm4`,
      `${baseAlias}.pm10`,
    ]

    const lateralJoins = []
    const bindParams = []

    for (const sensor of filteredSensors) {
      const alias = sensor
      const fields = {
        bme_280: ['bme_temp', 'bme_humid', 'bme_pressure'],
        scd_41: ['scd_temp', 'scd_humid', 'scd_co2'],
      }[sensor] || ['value']

      for (const field of fields) {
        selectFields.push(`${alias}.${field} AS ${field}`)
      }

      lateralJoins.push(`
        LEFT JOIN LATERAL (
          SELECT ${fields.join(', ')}
          FROM ${sensor}
          WHERE moduleid = ${baseAlias}.moduleid
          AND timestamp BETWEEN ? AND ?
          ORDER BY timestamp DESC
          LIMIT 1
        ) ${alias} ON true
      `)

      bindParams.push(startDate.toISOString(), endDate.toISOString())
    }

    const dynamicQuery = `
      SELECT ${selectFields.join(',\n')}
      FROM ${baseTable} ${baseAlias}
      ${lateralJoins.join('\n')}
      WHERE ${baseAlias}.moduleid = ?
      AND ${baseAlias}.timestamp BETWEEN ? AND ?
      ORDER BY ${baseAlias}.timestamp DESC
    `

    bindParams.push(moduleId, startDate.toISOString(), endDate.toISOString())

    const result = await db.raw(dynamicQuery, bindParams)

    return {
      moduleInfo,
      sensorData: result.rows,
    }
  } catch (err) {
    console.error('Error executing dynamic query', err)
    return { error: 'Internal server error', details: err.message }
  }
})
