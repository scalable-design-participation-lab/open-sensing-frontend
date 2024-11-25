import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SensorDataPoint {
  date: string
  value: number
}

export interface MetricData {
  data: SensorDataPoint[]
  min: number
  max: number
}

export interface SensorMetrics {
  [key: string]: MetricData
}

export interface SensorDataStore {
  sensorData: Record<string, SensorMetrics>
  isLoading: boolean
  loadSensorData: (sensorId: string) => Promise<void>
  clearSensorData: (sensorId: string) => void
  clearAllSensorData: () => void
}

export const useSensorDataStore = defineStore('sensorData', () => {
  const sensorData = ref<Record<string, SensorMetrics>>({})
  const isLoading = ref(false)

  const loadSensorData = async (sensorId: string) => {
    if (isLoading.value) return
    if (!sensorId) {
      console.warn('No sensor ID provided')
      return
    }

    isLoading.value = true
    try {
      const response = await $fetch(`/api/sensor-data/${sensorId}`)

      if (!response || typeof response !== 'object') {
        console.warn(`Invalid response for sensor ${sensorId}`)
        return
      }

      const processedData: SensorMetrics = {}

      Object.entries(response).forEach(([key, value]: [string, any]) => {
        if (value && Array.isArray(value.data)) {
          const validData = value.data
            .filter((d: any) => {
              if (!d || !d.date || d.value === undefined || d.value === null) {
                return false
              }

              // Validate date
              let date =
                typeof d.date === 'string'
                  ? /^\d+$/.test(d.date)
                    ? new Date(parseInt(d.date))
                    : new Date(d.date)
                  : new Date(d.date)

              if (isNaN(date.getTime()) || date.getFullYear() < 2000) {
                return false
              }

              // Validate value
              const numValue = Number(d.value)
              return !isNaN(numValue) && isFinite(numValue)
            })
            .map((d: any) => {
              let dateStr =
                typeof d.date === 'string'
                  ? /^\d+$/.test(d.date)
                    ? new Date(parseInt(d.date)).toISOString()
                    : new Date(d.date).toISOString()
                  : new Date(d.date).toISOString()

              return {
                date: dateStr,
                value: Number(d.value),
              }
            })
            .sort(
              (a: any, b: any) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            )

          if (validData.length > 0) {
            const values = validData.map((d) => Number(d.value))
            processedData[key] = {
              data: validData,
              min: Math.min(...values),
              max: Math.max(...values),
            }
          }
        }
      })

      if (Object.keys(processedData).length > 0) {
        sensorData.value[sensorId] = processedData
        console.log(
          `Processed ${
            Object.keys(processedData).length
          } metrics for sensor ${sensorId}`
        )
      } else {
        console.warn(`No valid data found for sensor ${sensorId}`)
      }
    } catch (error) {
      console.error(`Error loading data for sensor ${sensorId}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const clearSensorData = (sensorId: string) => {
    if (sensorData.value[sensorId]) {
      delete sensorData.value[sensorId]
    }
  }

  const clearAllSensorData = () => {
    sensorData.value = {}
  }

  return {
    sensorData,
    isLoading,
    loadSensorData,
    clearSensorData,
    clearAllSensorData,
  }
})
