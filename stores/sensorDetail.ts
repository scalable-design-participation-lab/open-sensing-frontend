import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useDashboardStore } from './dashboard'

export interface Sensor {
  moduleid: string
  ecohub_location: string
  lat: number | null
  lon: number | null
  temperature: number
  relative_humidity: number
  voc: number
  nox: number
  pm1: number
  pm25: number
  pm4: number
  pm10: number
  timestamp: string
}

export const useSensorDetailStore = defineStore('sensorDetail', () => {
  const dashboardStore = useDashboardStore()
  const showSensorInfo = ref(false)
  const showSensorDetail = ref(false)
  const selectedSensorId = ref<string | null>(null)
  const clickPosition = ref({ x: 0, y: 0 })
  const sensors = ref<Sensor[]>([])
  const isLoading = ref(false)

  const loadSensors = async () => {
    if (isLoading.value) return
    isLoading.value = true

    try {
      const response = await $fetch('/api/sensor-data')
      if (Array.isArray(response)) {
        sensors.value = response.map((sensor) => ({
          ...sensor,
          lat: sensor.lat || null,
          lon: sensor.lon || null,
          temperature: Number(sensor.temperature) || 0,
          relative_humidity: Number(sensor.relative_humidity) || 0,
          voc: Number(sensor.voc) || 0,
          nox: Number(sensor.nox) || 0,
          pm1: Number(sensor.pm1) || 0,
          pm25: Number(sensor.pm25) || 0,
          pm4: Number(sensor.pm4) || 0,
          pm10: Number(sensor.pm10) || 0,
        }))

        // 打印传感器数据
        console.log('=== All Sensors Data ===')
        sensors.value.forEach((sensor, index) => {
          console.log(`\nSensor ${index + 1}:`)
          console.log('Module ID:', sensor.moduleid)
          console.log('Location:', sensor.ecohub_location)
          console.log(
            'Coordinates:',
            sensor.lat && sensor.lon
              ? `lat: ${sensor.lat}, lon: ${sensor.lon}`
              : 'No coordinates'
          )
          console.log('Temperature:', sensor.temperature)
          console.log('Relative Humidity:', sensor.relative_humidity)
          console.log('VOC:', sensor.voc)
          console.log('NOx:', sensor.nox)
          console.log('PM1:', sensor.pm1)
          console.log('PM2.5:', sensor.pm25)
          console.log('PM4:', sensor.pm4)
          console.log('PM10:', sensor.pm10)
          console.log(
            'Last Updated:',
            new Date(sensor.timestamp).toLocaleString()
          )
          console.log('------------------------')
        })

        console.log('\nTotal Sensors:', sensors.value.length)
        console.log('=== End of Sensors Data ===\n')
      } else {
        console.error('Unexpected response format:', response)
        sensors.value = []
      }
    } catch (err) {
      console.error('Error loading sensors:', err)
      sensors.value = []
    } finally {
      isLoading.value = false
    }
  }

  const selectedSensor = computed(() =>
    sensors.value.find((sensor) => sensor.moduleid === selectedSensorId.value)
  )

  const toggleSensorDetail = () => {
    showSensorDetail.value = !showSensorDetail.value
    if (showSensorDetail.value) {
      showSensorInfo.value = false
      dashboardStore.showDashboard = false
    }
  }

  const updateSelectedSensor = (id: string) => {
    selectedSensorId.value = id
    showSensorInfo.value = true
    showSensorDetail.value = false
    dashboardStore.showDashboard = false
  }

  const getNextSensorId = () => {
    const currentIndex = sensors.value.findIndex(
      (sensor) => sensor.moduleid === selectedSensorId.value
    )
    return sensors.value[(currentIndex + 1) % sensors.value.length].moduleid
  }

  const getPreviousSensorId = () => {
    const currentIndex = sensors.value.findIndex(
      (sensor) => sensor.moduleid === selectedSensorId.value
    )
    return sensors.value[
      (currentIndex - 1 + sensors.value.length) % sensors.value.length
    ].moduleid
  }

  const selectNextSensor = () => {
    selectedSensorId.value = getNextSensorId()
  }

  const selectPreviousSensor = () => {
    selectedSensorId.value = getPreviousSensorId()
  }

  const closeSensorInfo = () => {
    showSensorInfo.value = false
  }

  const updateClickPosition = (position) => {
    clickPosition.value = position
  }

  return {
    showSensorInfo,
    showSensorDetail,
    selectedSensor,
    toggleSensorDetail,
    updateSelectedSensor,
    closeSensorInfo,
    sensors,
    selectedSensorId,
    clickPosition,
    updateClickPosition,
    selectNextSensor,
    selectPreviousSensor,
    loadSensors,
    isLoading,
  }
})
