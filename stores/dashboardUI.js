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
    temperature: true,
    heat_index: true,
    relative_humidity: true,
    pm25: true,
    pm10: true,
    relative_humidity: true,
  })
  const dataDashboard = ref(false)
  const selectedSite = ref('')
  const selectedSiteProps = ref({})
  const development = ref('')

  const dataDashboardValues = ref({ time: [0, 24], temperature: [], heat_index: [], relative_humidity: [], pm25: [], pm10: [] })

  // Setters
  // Set the list of existing Eco-Hubs
  function updateExistingHubs(hub, val) {
    return (existingHubs.value[hub] = val)
  }
  // Set the list of existing Datasets
  function updateExistingDatasets(dataset, val) {
    return (existingDatasets.value[dataset] = val)
  }

  // Getters
  // Get the list of Selected Eco-Hubs
  const selectedHubs = computed(() =>
    Object.keys(existingHubs.value).filter(
      (hub) => existingHubs.value[hub] == true
    )
  )
  // Get the list of Selected Datasets
  const selectedDatasets = computed(() =>
    Object.keys(existingDatasets.value).filter(
      (dataset) => existingDatasets.value[dataset] == true
    )
  )
  const hubsList = computed(() => Object.keys(existingHubs.value))

  return {
    existingHubs,
    existingDatasets,
    dataDashboard,
    dataDashboardValues,
    selectedSite,
    selectedSiteProps,
    development,
    updateExistingHubs,
    updateExistingDatasets,
    selectedHubs,
    selectedDatasets,
    hubsList,
  }
})
