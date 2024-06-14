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

  return {
    existingHubs,
    existingDatasets,
    dataDashboard,
    dataDashboardValues,
    sensorData,
    selectedSite,
    selectedSiteProps,
    development,
    selectedHubs,
    selectedDatasets,
    hubsList,
    dateRangeUpdate,
    toggleDataset,
    toggleHub,
    updateExistingHubs,
    updateExistingDatasets,
    loadSensorData,
    updateDataDashboardValues,
    updateDateRangeUpdate,
  }
})
