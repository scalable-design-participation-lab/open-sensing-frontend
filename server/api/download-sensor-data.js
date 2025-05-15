// server/api/download-sensor-data.js

import { defineEventHandler, readBody, createError } from 'h3'
import useDb from '../../utils/db'
import { parse } from 'json2csv'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const {
    datasets,
    dateRange,
    format,
    location: locationMap = {},
  } = await readBody(event)

  if (
    !datasets ||
    !dateRange ||
    !format ||
    typeof datasets !== 'object' ||
    !dateRange.start ||
    !dateRange.end
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Missing datasets, dateRange, or format.' },
    })
  }

  // 1) Initialize postgres.js client
  const sql = await useDb()

  try {
    // 2) Determine which fields to select
    const fieldMapping = {
      temperature: 'temperature',
      relative_humidity: 'relative_humidity',
      voc: 'voc',
      nox: 'nox',
      pm1: 'pm1',
      pm25: 'pm25',
      pm4: 'pm4',
      pm10: 'pm10',
    }
    const selectedDatasets = Object.entries(datasets)
      .filter(([, on]) => on)
      .map(([k]) => fieldMapping[k])
      .filter(Boolean)

    // Build an array of `sql.unsafe('s.col')` for each column
    const columnExpressions = selectedDatasets.map((col) =>
      sql.unsafe(`s.${col}`)
    )

    // 3) Build location filter if needed
    const selectedLocations = Object.entries(locationMap)
      .filter(([, on]) => on)
      .map(([loc]) => loc)

    // 4) Run the query with tagged template
    const rows = await sql`
      SELECT
        s.timestamp,
        ${sql.join(columnExpressions, sql`, `)}
      FROM sen55 s
      JOIN modules m ON s.moduleid = m.moduleid
      WHERE s.timestamp BETWEEN ${dateRange.start} AND ${dateRange.end}
      ${
        selectedLocations.length
          ? sql`AND m.ecohub_location = ANY(${selectedLocations})`
          : sql``
      }
      ORDER BY s.timestamp DESC
    `

    // 5) Return CSV or JSON
    if (format === 'csv') {
      return parse(rows)
    } else {
      return rows
    }
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: { message: 'Failed to retrieve data', details: err.message },
    })
  } finally {
    // close the connection (in serverless environments you often want this)
    await sql.end()
  }
})
