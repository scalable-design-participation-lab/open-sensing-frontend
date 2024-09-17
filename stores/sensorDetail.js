import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import sensorLocations from '../static/Sensor_Locations_NEU.json'
import { useDashboardStore } from './dashboard'

export const useSensorDetailStore = defineStore('sensorDetail', () => {
  const dashboardStore = useDashboardStore()
  const showSensorInfo = ref(false)
  const showSensorDetail = ref(false)
  const selectedSensorId = ref(null)
  const clickPosition = ref({ x: 0, y: 0 })

  const locations = [
    'Architecture Studios',
    'Cabot Center',
    'Cargill Hall',
    'Carter Playground',
    'Centennial Common',
    'Columbus Garage',
    'Curry Student Center',
    'Forsyth Building',
    'Gainsborough Garage',
    'Gainsborough Garage Roof',
    'ISEC Terrace',
    'Matthews Arena',
    'Robinson Hall',
    'Snell Library Quad',
  ]

  const getRandomValue = (min, max) => Math.random() * (max - min) + min

  const sensors = ref(
    sensorLocations.features.map((feature, index) => ({
      id: feature.properties.OBJECTID,
      location: locations[index % locations.length],
      temperature: feature.properties.temperature,
      humidity: feature.properties.relative_humidity,
      voc: feature.properties.voc,
      nox: feature.properties.nox,
      pm25: Number(feature.properties.pm25.toFixed(2)),
      coordinates: feature.geometry.coordinates,
      timestamp: new Date(feature.properties.timestamp).toLocaleString(),
      batteryLevel: Math.floor(getRandomValue(20, 100)),
      signalStrength: Math.floor(getRandomValue(1, 5)),
      lastMaintenance: new Date(
        Date.now() - getRandomValue(0, 30 * 24 * 60 * 60 * 1000)
      ).toLocaleDateString(),
      status: ['Active', 'Inactive', 'Maintenance'][
        Math.floor(Math.random() * 3)
      ],
      airQuality: ['Good', 'Moderate', 'Poor', 'Very Poor'][
        Math.floor(Math.random() * 4)
      ],
      soilMoisture: getRandomValue(20, 80).toFixed(1) + '%',
    }))
  )

  const selectedSensor = computed(() =>
    sensors.value.find((sensor) => sensor.id === selectedSensorId.value)
  )

  const toggleSensorDetail = () => {
    showSensorDetail.value = !showSensorDetail.value
    if (showSensorDetail.value) {
      showSensorInfo.value = false
      dashboardStore.showDashboard = false
    }
  }

  const updateSelectedSensor = (id) => {
    selectedSensorId.value = id
    showSensorInfo.value = true
    showSensorDetail.value = false
    dashboardStore.showDashboard = false
  }

  const getNextSensorId = () => {
    const currentIndex = sensors.value.findIndex(
      (sensor) => sensor.id === selectedSensorId.value
    )
    return sensors.value[(currentIndex + 1) % sensors.value.length].id
  }

  const getPreviousSensorId = () => {
    const currentIndex = sensors.value.findIndex(
      (sensor) => sensor.id === selectedSensorId.value
    )
    return sensors.value[
      (currentIndex - 1 + sensors.value.length) % sensors.value.length
    ].id
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
  }
})
