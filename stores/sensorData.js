import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSensorDataStore = defineStore('sensorData', () => {
  const sensorData = ref({})
  const moduleInfo = ref(null)
  const lastFetchTime = ref({})
  const isFetching = ref(false)

  const loadSensorData = async (moduleId, force = false) => {
    const cacheTime = 5400000 // 1h30m

    if (
      force ||
      !sensorData.value[moduleId] ||
      !lastFetchTime.value[moduleId] ||
      Date.now() - lastFetchTime.value[moduleId] > cacheTime
    ) {
      if (isFetching.value) return sensorData.value[moduleId]
      isFetching.value = true

      try {
        const response = await $fetch('/api/sensor-data', {
          params: { moduleId },
        })

        if (response.error) {
          throw new Error(response.error)
        }

        const { moduleInfo: info, sensorData: data } = response
        moduleInfo.value = info

        const metrics = {
          Temperature: { name: 'temperature', label: 'Temperature (°C)' },
          'Relative Humidity': {
            name: 'relative_humidity',
            label: 'Relative Humidity (%)',
          },
          'VOC (ppb)': { name: 'voc', label: 'VOC (ppb)' },
          'NOx (ppb)': { name: 'nox', label: 'NOx (ppb)' },
          pm1: { name: 'pm1', label: 'pm1 (µg/m³)' },
          pm2_5: { name: 'pm25', label: 'pm2.5 (µg/m³)' },
          pm4: { name: 'pm4', label: 'pm4 (µg/m³)' },
          pm10: { name: 'pm10', label: 'pm10 (µg/m³)' },
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

        sensorData.value[moduleId] = metricData
        lastFetchTime.value[moduleId] = Date.now()
      } catch (err) {
        console.error('Error in loadSensorData:', err)
        throw err
      } finally {
        isFetching.value = false
      }
    }
    return sensorData.value[moduleId]
  }

  return {
    sensorData,
    moduleInfo,
    loadSensorData,
  }
})
