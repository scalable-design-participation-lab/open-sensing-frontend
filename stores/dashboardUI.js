import { max, min } from 'lodash'
import * as d3 from 'd3'

export const useDashboardUIStore = defineStore('dashboardUI', () => {
  // State Properties
  const existingHubs = ref({
    HOWARD: true,
    'BAY VIEW': true,
    ASTORIA: true,
    WAGNER: true,
    FOREST: true,
    "MARINER'S HARBOR": true,
  })
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

  const sensorData = ref({})

  const dateRangeUpdate = ref(null)

  const masterSolutions = ref([])

  const selectedSolution = ref({})

  const parsedSolutions = ref([])

  const solutionsObject = ref({})

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
  function loadSensorData(data) {
    sensorData.value = data
  }

  // Update datadashboard values
  function updateDataDashboardValues(dataType, data) {
    dataDashboardValues.value[dataType] = data
  }

  // Update the dateRangeUpdate
  function updateDateRangeUpdate(data) {
    dateRangeUpdate.value = data
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

  return {
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
    hubsList,
    selectedHubs,
    selectedDatasets,
    updatedMaxMinVals,
    feasibleSites,
  }
})
