// utils/aqi.ts
export type Breakpoint = {
  concLo: number
  concHi: number
  aqiLo: number
  aqiHi: number
}

export type PollutantConfig = {
  id: 'pm25' | 'pm10' | 'o3' | 'co' | 'no2' | 'so2'
  unit: string
  avgWindowHours: number
  truncateDecimals: number
  breakpoints: Breakpoint[]
}

export const PM25_CONFIG: PollutantConfig = {
  id: 'pm25',
  unit: 'µg/m³',
  avgWindowHours: 24,
  truncateDecimals: 1,
  breakpoints: [
    { concLo: 0.0, concHi: 12.0, aqiLo: 0, aqiHi: 50 },
    { concLo: 12.1, concHi: 35.4, aqiLo: 51, aqiHi: 100 },
    { concLo: 35.5, concHi: 55.4, aqiLo: 101, aqiHi: 150 },
    { concLo: 55.5, concHi: 150.4, aqiLo: 151, aqiHi: 200 },
    { concLo: 150.5, concHi: 250.4, aqiLo: 201, aqiHi: 300 },
    { concLo: 250.5, concHi: 350.4, aqiLo: 301, aqiHi: 400 },
    { concLo: 350.5, concHi: 500.4, aqiLo: 401, aqiHi: 500 },
  ],
}

export function truncateDecimals(value: number, decimals: number): number {
  const f = 10 ** decimals
  return Math.trunc(value * f) / f
}

export function findBreakpoint(
  cfg: PollutantConfig,
  cp: number
): Breakpoint | null {
  return (
    cfg.breakpoints.find((bp) => cp >= bp.concLo && cp <= bp.concHi) ?? null
  )
}

export function calcSubIndex(cpRaw: number, cfg: PollutantConfig) {
  const cp = truncateDecimals(cpRaw, cfg.truncateDecimals)
  const bp = findBreakpoint(cfg, cp)
  if (!bp)
    return { aqi: null as number | null, cp, range: null as Breakpoint | null }

  const { concLo, concHi, aqiLo, aqiHi } = bp
  const aqi = ((cp - concLo) / (concHi - concLo)) * (aqiHi - aqiLo) + aqiLo
  return { aqi: Math.round(aqi), cp, range: bp }
}

export function categorizeAQI(aqi: number) {
  if (aqi <= 50) return { category: 'Good', color: '#00e400' }
  if (aqi <= 100) return { category: 'Moderate', color: '#ffff00' }
  if (aqi <= 150)
    return { category: 'Unhealthy for Sensitive Groups', color: '#ff7e00' }
  if (aqi <= 200) return { category: 'Unhealthy', color: '#ff0000' }
  if (aqi <= 300) return { category: 'Very Unhealthy', color: '#8f3f97' }
  return { category: 'Hazardous', color: '#7e0023' }
}

export function pickOverallAQI(
  subs: Array<{ pollutant: string; aqi: number | null }>
) {
  const valid = subs.filter((s) => typeof s.aqi === 'number') as Array<{
    pollutant: string
    aqi: number
  }>
  if (valid.length === 0) return null
  return valid.reduce((max, cur) => (cur.aqi > max.aqi ? cur : max))
}
