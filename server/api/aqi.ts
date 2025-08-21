import { defineEventHandler, getQuery, createError } from 'h3'
import db from '~/utils/db'
import {
  PM25_CONFIG,
  calcSubIndex,
  pickOverallAQI,
  categorizeAQI,
} from '~/utils/aqi'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const moduleId = Array.isArray(q.moduleId) ? q.moduleId[0] : q.moduleId
  if (!moduleId)
    throw createError({
      statusCode: 400,
      statusMessage: 'moduleId is required',
    })

  const sql = `
WITH latest_day AS (
  SELECT DATE("timestamp") AS day
  FROM sen55
  WHERE moduleid = ?
  ORDER BY "timestamp" DESC
  LIMIT 1
)
SELECT AVG(pm25) AS pm25_avg_day
FROM sen55
WHERE moduleid = ?
  AND DATE("timestamp") = (SELECT day FROM latest_day)
  AND pm25 IS NOT NULL
`
  const result = await db.raw(sql, [moduleId, moduleId])
  const pm25Avg = result?.rows?.[0]?.pm25_avg_day ?? null

  const pm25 =
    pm25Avg != null
      ? calcSubIndex(pm25Avg, PM25_CONFIG)
      : { aqi: null, cp: null, range: null }

  const sub = [
    {
      pollutant: 'pm25',
      aqi: pm25.aqi,
      cp: pm25.cp,
      unit: PM25_CONFIG.unit,
      range: pm25.range,
    },
  ]
  const overall = pickOverallAQI(
    sub.map((s) => ({ pollutant: s.pollutant, aqi: s.aqi }))
  )
  const cat = overall ? categorizeAQI(overall.aqi) : null

  return {
    moduleId,
    windowHours: 24,
    subIndices: sub,
    overall: overall
      ? { pollutant: overall.pollutant, aqi: overall.aqi, ...cat }
      : null,
    generatedAt: new Date().toISOString(),
  }
})
