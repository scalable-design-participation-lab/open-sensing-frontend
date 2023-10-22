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

  // Setters
  // Set the list of existing Eco-Hubs
  const updateExistingHubs = (hub, val) => {
    existingHubs.value[hub] = val
  }
  // Set the list of existing Datasets
  const updateExistingDatasets = (dataset, val) => {
    existingDatasets.value[dataset] = val
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

  return {
    existingHubs,
    existingDatasets,
    dataDashboard,
    updateExistingHubs,
    updateExistingDatasets,
    selectedHubs,
    selectedDatasets,
  }
})
