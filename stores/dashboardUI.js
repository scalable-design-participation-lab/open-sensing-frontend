import * as d3 from 'd3'
import sensorLocations from '~/static/Sensor_Locations_NEU.json'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDashboardUIStore = defineStore('dashboardUI', () => {
  const showSensorInfo = ref(false)
  const showSensorDetail = ref(false)
  const selectedSensorId = ref(null)

  const selectedSensor = computed(() =>
    sensors.value.find((sensor) => sensor.id === selectedSensorId.value)
  )

  const toggleSensorDetail = () => {
    showSensorDetail.value = !showSensorDetail.value
  }

  const updateSelectedSensor = (id) => {
    selectedSensorId.value = id
    showSensorInfo.value = true
    showSensorDetail.value = false
  }

  const closeSensorInfo = () => {
    showSensorInfo.value = false
  }

  const updateClickPosition = (position) => {
    clickPosition.value = position
  }
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
      pm25: feature.properties.pm25,
      coordinates: feature.geometry.coordinates,
      timestamp: new Date(feature.properties.timestamp).toLocaleString(),
      // Additional mock data
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

  const sensorData = ref({})
  const lastFetchTime = ref(null)
  const isFetching = ref(false)

  const showFilter = ref(false)

  const toggleFilter = () => {
    showFilter.value = !showFilter.value
    console.log('Filter toggled:', showFilter.value)
  }

  const showDashboard = ref(false)

  const toggleDashboard = () => {
    console.log('Store: toggleDashboard called')
    showDashboard.value = !showDashboard.value
    console.log('Store: showDashboard after toggle:', showDashboard.value)
  }

  const setPopUpVisibility = (popUp) => {
    console.log('Store: setPopUpVisibility called with:', popUp)
    if (popUp === 'dashboard') {
      showDashboard.value = true
    } else {
      showDashboard.value = false
    }
    console.log(
      'Store: showDashboard after setPopUpVisibility:',
      showDashboard.value
    )
  }

  const closeFilter = () => {
    showFilter.value = false
    console.log('Filter closed')
  }

  const clickPosition = ref({ x: 0, y: 0 })

  // State Properties
  const existingHubs = ref(
    Object.fromEntries(locations.map((loc) => [loc, true]))
  )
  const existingDatasets = ref({
    Temperature: true,
    'Relative Humidity': true,
    'VOC (ppb)': true,
    'NOx (ppb)': true,
    pm1: true,
    'pm2.5': true,
    pm4: true,
    pm10: true,
  })
  const dataDashboard = ref(false)
  const selectedSite = ref('')
  const selectedSiteProps = ref({})
  const development = ref('')

  const dataDashboardValues = ref({
    time: [0, 24],
    temperature: [],
    heat_index: [],
    relative_humidity: [],
    pm25: [],
    pm10: [],
    dateRange: [],
    dateRangeValues: [],
  })

  const dateRangeUpdate = ref(null)

  const masterSolutions = ref([])

  const selectedSolution = ref({})

  const parsedSolutions = ref([])

  const solutionsObject = ref({})

  const popUpVisibility = ref({
    pcoords: false,
    dashboard: false,
    about: false,
  })

  const dashboardData = ref(null)

  // Setters
  // Set the list of existing Eco-Hubs
  function updateExistingHubs(hub, val) {
    return (existingHubs.value[hub] = val)
  }
  // Set the list of existing Datasets
  function updateExistingDatasets(dataset, val) {
    existingDatasets.value[dataset] = val
  }

  // Toggle visibility of datasets
  function toggleDataset(datasetKey) {
    existingDatasets.value[datasetKey] = !existingDatasets.value[datasetKey]
  }

  // Toggle visibility of hubs
  function toggleHub(hubKey) {
    existingHubs.value[hubKey] = !existingHubs.value[hubKey]
  }

  // Load the data for the sensor
  async function loadSensorData(force = false) {
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
          metricData[key] = data.map((d) => ({
            date: new Date(d.timestamp),
            value: d[metrics[key].name],
          }))
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

  // Update datadashboard values
  function updateDataDashboardValues(dataType, data) {
    dataDashboardValues.value[dataType] = data
  }

  // Load Master Solutions
  const loadMasterSolutions = async () => {
    const response = await fetch('/master_solutions.csv')
    const text = await response.text()
    const data = d3.csvParse(text, (d) => {
      // turn every value into a number
      const newD = {}
      Object.keys(d).forEach((key) => {
        newD[key] = +d[key]
      })
      return newD
    })
    masterSolutions.value = data
  }

  const setSelectedSolution = (solution) => {
    selectedSolution.value = solution
  }

  const updateParsedSolutions = (solutions) => {
    parsedSolutions.value = solutions
  }

  const updateSolutionsObject = (solutions) => {
    solutionsObject.value = solutions
  }

  const updateSelectedSite = (site) => {
    selectedSite.value = site
  }

  const updateSelectedSiteProps = (props) => {
    selectedSiteProps.value = props
  }

  const updateDateRangeUpdate = (date) => {
    dateRangeUpdate.value = date
  }

  const loadDashboardData = async () => {
    if (!dashboardData.value) {
      // Simulate data loading
      await new Promise((resolve) => setTimeout(resolve, 1000))
      dashboardData.value = {
        /* loaded data */
      }
    }
    return dashboardData.value
  }

  // Getters
  // Get the list of Selected Eco-Hubs
  const selectedHubs = computed(() =>
    Object.keys(existingHubs.value).filter(
      (hub) => existingHubs.value[hub] == true
    )
  )
  // Get the list of Selected Datasets
  const selectedDatasets = computed(() => {
    if (Object.keys(existingDatasets.value).length === 0) return []
    else
      return Object.keys(existingDatasets.value).filter(
        (dataset) => existingDatasets.value[dataset] === true
      )
  })

  // Get the list of Eco-Hubs
  const hubsList = computed(() => Object.keys(existingHubs.value))

  // Get the max and min values for the master solutions
  const updatedMaxMinVals = computed(() => {
    const vals = {}
    // iterate through keys in masterSolutions
    if (masterSolutions.value.length === 0) return vals
    Object.keys(masterSolutions.value[0]).forEach(
      (key) =>
        (vals[key] = {
          max: Math.max(...masterSolutions.value.map((o) => o[key])),
          min: Math.min(...masterSolutions.value.map((o) => o[key])),
        })
    )
    return vals
  })

  const feasibleSites = computed(() => {
    const MIN_HUB_AREA = 2 // acres

    return parsedSolutions.value.filter(
      (site) => site.AREA_BUILD >= MIN_HUB_AREA && site.HAS_ECO_HUB === '0.0'
    )
  })

  const builtSites = computed(() =>
    parsedSolutions.value.filter((site) => site.BUILT !== '0')
  )

  return {
    showSensorInfo,
    showSensorDetail,
    selectedSensor,
    toggleSensorDetail,
    updateSelectedSensor,
    closeSensorInfo,
    sensors,
    selectedSensorId,
    selectedSensor,
    showSensorDetail,
    toggleSensorDetail,
    updateSelectedSensor,
    showDashboard,
    toggleDashboard,
    clickPosition,
    updateClickPosition,
    masterSolutions,
    existingHubs,
    existingDatasets,
    dataDashboard,
    dataDashboardValues,
    sensorData,
    selectedSite,
    selectedSiteProps,
    development,
    dateRangeUpdate,
    selectedSolution,
    parsedSolutions,
    solutionsObject,
    popUpVisibility,
    toggleDataset,
    toggleHub,
    updateExistingHubs,
    updateExistingDatasets,
    loadSensorData,
    updateDataDashboardValues,
    updateDateRangeUpdate,
    loadMasterSolutions,
    setSelectedSolution,
    updateParsedSolutions,
    updateSolutionsObject,
    setPopUpVisibility,
    hubsList,
    selectedHubs,
    selectedDatasets,
    updatedMaxMinVals,
    feasibleSites,
    builtSites,
    updateSelectedSite,
    updateSelectedSiteProps,
    updateDateRangeUpdate,
    loadDashboardData,
    showFilter,
    toggleFilter,
    closeFilter,
  }
})
