// server/api/ingest-sensor-data.ts
import { defineEventHandler, readBody, createError } from 'h3'
import sql from '../../utils/db'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  // 1) parse & validate payload
  const body = await readBody(event)
  logger.info('Received sensor data request with body:', body)

  if (!body || typeof body.ID !== 'string') {
    logger.error('Missing or invalid body.ID')
    throw createError({
      statusCode: 400,
      statusMessage: 'Request body.ID is required',
    })
  }

  // 2) extract moduleId
  const [, integerPart] = body.ID.split(':')
  const moduleId = integerPart ?? null
  logger.debug('Parsed ModuleID:', moduleId)

  // 3) build normalized data object
  const timestamp = body.timestamp
    ? new Date(body.timestamp * 1000)
    : new Date()

  const data = {
    moduleId,
    temperature: body.Temperature ?? null,
    humidity: body.Relative_Humidity ?? null,
    voc: body.VOC ?? null,
    nox: body.NOx ?? null,
    pm1: body.PM1 ?? null,
    pm25: body.PM25 ?? null,
    pm4: body.PM4 ?? null,
    pm10: body.PM10 ?? null,
    soilMoisture: body.Soil_Moisture ?? null,
    solarInputCurrent: body.Solar_Input_Current ?? null,
    batteryLevel: body.Battery_Level ?? null,
    lat: body.Lat ?? null,
    lon: body.Lon ?? null,
    localTemp: body.Local_Temp ?? null,
    voltage: body.Voltage ?? null,
    bmeTemp: body['BME-Temp'] ?? null,
    timestamp,
  }
  logger.debug('Processed data:', data)

  try {
    // 4) run in a transaction
    const result = await sql.begin(async (tx) => {
      // a) upsert module
      await tx`
        INSERT INTO Modules (ModuleId)
        SELECT ${data.moduleId}
        WHERE NOT EXISTS (
          SELECT 1 FROM Modules WHERE ModuleId = ${data.moduleId}
        )
      `
      logger.debug('Module ID ensured in Modules table')

      // b) insert into each sensor table
      await Promise.all([
        tx`
          INSERT INTO SEN55 (
            ModuleID, Temperature, Relative_Humidity, VOC, NOx,
            PM1, PM25, PM4, PM10, timestamp
          ) VALUES (
            ${data.moduleId}, ${data.temperature}, ${data.humidity},
            ${data.voc}, ${data.nox}, ${data.pm1}, ${data.pm25},
            ${data.pm4}, ${data.pm10}, ${data.timestamp}
          )
        `,
        tx`
          INSERT INTO Soil (ModuleID, Soil_Moisture, timestamp)
          VALUES (${data.moduleId}, ${data.soilMoisture}, ${data.timestamp})
        `,
        tx`
          INSERT INTO Current_Sensor (
            ModuleID, Solar_Input_Current, timestamp
          ) VALUES (
            ${data.moduleId}, ${data.solarInputCurrent}, ${data.timestamp}
          )
        `,
        tx`
          INSERT INTO Microcontroller (
            ModuleID, Battery_Level, timestamp
          ) VALUES (
            ${data.moduleId}, ${data.batteryLevel}, ${data.timestamp}
          )
        `,
        tx`
          INSERT INTO GPS (ModuleID, Lat, Lon, timestamp)
          VALUES (${data.moduleId}, ${data.lat}, ${data.lon}, ${data.timestamp})
        `,
        tx`
          INSERT INTO Blues_Notecard (
            ModuleID, temperature, voltage, timestamp
          ) VALUES (
            ${data.moduleId}, ${data.localTemp}, ${data.voltage}, ${data.timestamp}
          )
        `,
        tx`
          INSERT INTO bme_280 (ModuleID, bme_temp, timestamp)
          VALUES (${data.moduleId}, ${data.bmeTemp}, ${data.timestamp})
        `,
      ])

      return {
        message: 'Data inserted successfully',
        moduleId: data.moduleId,
      }
    })

    logger.info('Successfully inserted all sensor data')
    return result
  } catch (err) {
    // postgres.js auto-rolls back on error
    logger.error('Error processing sensor data:', err)
    const error = err as { code?: string; message?: string }
    throw createError({
      statusCode: error.code === '23505' ? 409 : 500,
      statusMessage: 'Failed to insert sensor data',
      data: { message: error.message },
    })
  }
})
