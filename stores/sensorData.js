import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSensorDataStore = defineStore('sensorData', () => {
  const sensorData = ref({})
  const lastFetchTime = ref(null)
  const isFetching = ref(false)

  const loadSensorData = async (force = false) => {
    const cacheTime = 5400000 // 1h30m
    if (
      force ||
      !sensorData.value ||
      !lastFetchTime.value ||
      Date.now() - lastFetchTime.value > cacheTime
    ) {
      if (isFetching.value) return sensorData.value
      isFetching.value = true
      try {
        const data = await $fetch('/api/sensor-data')
        const metrics = {
          Temperature: { name: 'temperature', label: 'Temperature (°C)' },
          'Relative Humidity': {
            name: 'relative_humidity',
            label: 'Relative Humidity (%)',
          },
          'VOC (ppb)': { name: 'voc', label: 'VOC (ppb)' },
          'NOx (ppb)': { name: 'nox', label: 'NOx (ppb)' },
          pm1: { name: 'pm1', label: 'PM1 (µg/m³)' },
          'pm2.5': { name: 'pm25', label: 'PM2.5 (µg/m³)' },
          pm4: { name: 'pm4', label: 'PM4 (µg/m³)' },
          pm10: { name: 'pm10', label: 'PM10 (µg/m³)' },
        }

        const metricData = {}
        Object.keys(metrics).forEach((key) => {
          const values = data.map((d) => d[metrics[key].name])
          metricData[key] = {
            data: data.map((d) => ({
              date: new Date(d.timestamp),
              value: d[metrics[key].name],
            })),
            min: Math.min(...values),
            max: Math.max(...values),
          }
        })
        sensorData.value = metricData
        lastFetchTime.value = Date.now()
      } catch (err) {
        console.error('Error fetching sensor data', err)
      } finally {
        isFetching.value = false
      }
    }
    return sensorData.value
  }

  return {
    sensorData,
    loadSensorData,
  }
})
