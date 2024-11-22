<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMapUIStore } from '../stores/mapUI'

// Map store
const mapUIStore = useMapUIStore()
const { setMapType } = mapUIStore
const currentMapType = ref('light')

const leftItems = ref([
  {
    label: 'Drawing Participation',
    variant: 'solid',
    color: 'black',
  },
  {
    label: 'Гуртомá',
    variant: 'solid',
    color: 'black',
  },
])

const mapItems = [
  [
    {
      label: 'Light',
      icon: 'i-heroicons-sun-20-solid',
      click: () => setMapType('satellite'),
    },
    {
      label: 'Satellite',
      icon: 'i-heroicons-globe-americas-20-solid',
      click: () => setMapType('light'),
    },
  ],
]

const rightItems = ref([
  {
    icon: 'i-heroicons-arrow-down-tray-20-solid',
    onClick: () => (showDownloadPopup.value = true),
  },
  {
    icon: computed(() =>
      currentMapType.value === 'light'
        ? 'i-heroicons:map'
        : 'i-heroicons:globe-americas-20-solid',
    ),
    onClick: () => {
      currentMapType.value =
        currentMapType.value === 'light' ? 'satellite' : 'light'
      setMapType(currentMapType.value)
    },
  },
])

const isMapBlurred = computed(() => mapUIStore.showRegistration)

const showDownloadPopup = ref(false)
const showOnboarding = ref(true)
const showRegistration = ref(false)

const handleDownload = async (options: {
  dataType: string
  dateRange: [Date | null, Date | null]
  region: string[]
  format: string
}) => {
  try {
    const { dataType, dateRange, region, format } = options

    // Here you would implement the actual API call or data processing
    console.log('Downloading data with options:', {
      dataType,
      dateRange,
      region,
      format,
    })

    // Example download implementation
    const data = {
      // Your data here
    }

    // Create and trigger download
    const blob = new Blob(
      [format === 'json' ? JSON.stringify(data) : convertToCSV(data)],
      { type: format === 'json' ? 'application/json' : 'text/csv' },
    )

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `ukraine-data.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download failed:', error)
  }
}

// Add this helper function for CSV conversion
const convertToCSV = (data: any) => {
  // Implement CSV conversion logic here
  return 'data,in,csv,format'
}

const handleShowRegistration = () => {
  showOnboarding.value = false
  showRegistration.value = true
}

const handleCloseRegistration = () => {
  showRegistration.value = false
}
</script>

<template>
  <div class="relative">
    <SideBar class="z-30" />
    <BackgroundMap
      :class="{ 'filter blur-md': isMapBlurred }"
      :show-all-plus-icons="true"
      :show-comment-icons="false"
    />
    <GeneralizedHeader
      class="z-20"
      :left-items="leftItems"
      :right-items="rightItems"
      logo-src="/restart-agency.svg"
      logo-alt="Restart Agency Logo"
      :show-icon="true"
    />
    <GeneralizedFooter class="z-20" />
    <OnboardingModal
      :is-visible="showOnboarding"
      @show-registration="handleShowRegistration"
    />
    <RegistrationModal
      :is-visible="showRegistration"
      @close="handleCloseRegistration"
    />
    <div
      v-if="isMapBlurred"
      class="absolute inset-0 bg-black bg-opacity-50 z-40"
      @click.self="mapUIStore.showRegistration = true"
    ></div>
    <Teleport to="body">
      <DownloadModalHurtoma
        v-model="showDownloadPopup"
        @download="handleDownload"
      />
    </Teleport>
  </div>
</template>
<style scoped>
.blur-md {
  filter: blur(8px);
}
</style>
