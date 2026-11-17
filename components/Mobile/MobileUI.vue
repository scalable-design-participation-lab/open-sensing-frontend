<!--
 * MobileUI Component
 *
 * Mobile layout chrome (Figma: Open Sensing / Mobile page): the bottom dock,
 * its contextual tray, and the sheets that open above it — welcome,
 * assistant, sensor list, report and filter. Hidden from the `md`
 * breakpoint up, where the header / toolbar / footer take over.
 *
 * @displayName MobileUI
 * @usage
 * <MobileUI
 *   :locations="listOfLocations"
 *   :date-range="selected"
 *   @select-location="handleLocationSelect"
 *   @filter-change="handleFilterChange"
 *   @reset="resetAllFilters"
 *   @download="showDownloadPopup = true"
 * />
 -->
<template>
  <!-- The dashboard and sensor detail overlays fill the screen on phones -->
  <div
    v-show="
      !dashboardStore.showDashboard && !sensorDetailStore.showSensorDetail
    "
    class="md:hidden"
  >
    <a
      href="https://scalabledesignparticipation.org"
      target="_blank"
      rel="noopener"
      aria-label="Scalable Design Participation Lab"
      class="fixed left-1/2 top-4 z-[5] -translate-x-1/2 text-4xl leading-none"
    >
      🤲
    </a>

    <div
      class="pointer-events-none fixed inset-x-2 bottom-[17px] top-[74px] z-[5] flex flex-col justify-end gap-2.5 text-[13px] leading-[1.15] text-black"
    >
      <section
        v-if="sheet === 'welcome'"
        class="card sheet"
        data-testid="welcome"
      >
        <header class="flex items-center justify-between">
          <h2 class="font-bold">Welcome to Open Sensing</h2>
          <button class="round" aria-label="Close" @click="sheet = null">
            <UIcon name="i-heroicons-x-mark" />
          </button>
        </header>
        <hr class="border-black/15" />
        <div
          v-if="locations.length"
          class="flex flex-wrap justify-center gap-2"
        >
          <button
            v-for="loc in locations"
            :key="loc.value"
            class="tag"
            @click="selectLocation(loc)"
          >
            {{ loc.label }}
          </button>
        </div>
        <p>
          Open Sensing shows real-time environmental data from open sensor
          modules across the world. Tap a sensor on the map to see its latest
          readings, or pick a location above to jump there.
        </p>
        <button
          class="self-center rounded-full border border-black/60 px-5 py-3"
          @click="sheet = null"
        >
          Get started
        </button>
      </section>

      <section v-else-if="sheet === 'assistant'" class="card sheet">
        <header class="flex items-center justify-between">
          <h2 class="font-bold">Assistant</h2>
          <button class="round" aria-label="Close" @click="sheet = null">
            <UIcon name="i-heroicons-arrow-down" />
          </button>
        </header>
        <hr class="border-black/15" />
        <button
          class="orb h-[60px] w-[60px] self-center"
          :class="{ 'animate-pulse': listening }"
          aria-label="Start voice command"
          @click="listen"
        />
        <p aria-live="polite">
          {{
            heard ||
            'Tap the circle and say “change the map style to vector”, “show filters”, or “open dashboard”.'
          }}
        </p>
      </section>

      <ul
        v-else-if="sheet === 'list'"
        class="pointer-events-auto -m-1 flex min-h-0 flex-col gap-2 overflow-y-auto p-1"
        data-testid="sensor-list"
      >
        <li v-if="!filteredSensors.length" class="card p-5">
          No sensors match the current filters.
        </li>
        <li v-for="sensor in filteredSensors" :key="sensor.moduleid">
          <button
            class="card flex h-[59px] w-full items-center gap-3.5 px-3 text-left text-[15px]"
            @click="selectSensor(sensor.moduleid)"
          >
            <span
              class="h-10 w-10 shrink-0 rounded-full"
              :class="isActive(sensor) ? 'bg-[#66FF4D]' : 'bg-[#B3B3B3]'"
            />
            <span class="min-w-0">
              <span class="block truncate">{{ sensor.ecohub_location }}</span>
              <span class="block truncate text-black/30">
                {{
                  isActive(sensor)
                    ? `${sensor.temperature.toFixed(1)}°C · ${Math.round(
                        sensor.relative_humidity
                      )}% humidity`
                    : 'Inactive'
                }}
              </span>
            </span>
          </button>
        </li>
      </ul>

      <template v-else-if="sheet === 'report'">
        <section class="card pointer-events-auto p-4">
          <h2 class="text-[15px]">
            Northeastern University
            <span class="text-[13px] text-black/30">Open Sensing</span>
          </h2>
          <p class="mt-2">An overview of all sensor data across the world.</p>
        </section>
        <div
          class="no-scrollbar pointer-events-auto -mx-2 flex shrink-0 snap-x gap-2 overflow-x-auto px-2 py-1"
        >
          <section
            v-for="card in reportCards"
            :key="card.title"
            class="card flex h-[230px] w-[295px] shrink-0 snap-center flex-col p-4"
          >
            <header class="flex items-center justify-between text-[15px]">
              <h3>{{ card.title }}</h3>
              <button
                v-if="card.open"
                class="-m-3 p-3"
                aria-label="Open dashboard"
                @click="card.open"
              >
                <UIcon name="i-heroicons-arrow-up-right" />
              </button>
            </header>
            <div class="flex flex-1 items-center justify-around">
              <div
                class="bubble grid h-[104px] w-[104px] place-items-center text-[30px] font-bold"
              >
                {{ card.value }}
              </div>
              <dl class="flex flex-col gap-3.5 text-xs">
                <div
                  v-for="stat in card.stats"
                  :key="stat.label"
                  class="bubble w-[97px] !rounded-lg py-2 text-center"
                >
                  <dt>{{ stat.label }}</dt>
                  <dd class="mt-1">{{ stat.value }}</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </template>

      <section v-else-if="sheet === 'filter'" class="card sheet min-h-0">
        <header class="flex items-center justify-between">
          <h2 class="font-bold">Filters</h2>
          <button class="round" aria-label="Close" @click="sheet = null">
            <UIcon name="i-heroicons-arrow-up-right" />
          </button>
        </header>
        <hr class="border-black/15" />
        <MobileFilter
          class="min-h-0"
          :date-range="dateRange"
          @filter-change="$emit('filter-change', $event)"
        />
      </section>

      <!-- Tray: tucks behind the dock (10px gap + 75px dock = 85px) -->
      <div
        v-if="tray.length"
        class="card pointer-events-auto -mb-[85px] flex shrink-0 justify-center gap-[25px] pb-[97px] pt-4"
      >
        <button
          v-for="item in tray"
          :key="item.label"
          class="bubble grid h-12 w-12 place-items-center"
          :aria-label="item.label"
          @click="item.action"
        >
          <UIcon :name="item.icon" class="h-5 w-5" />
        </button>
      </div>

      <nav
        class="card pointer-events-auto relative flex h-[75px] shrink-0 items-center justify-center gap-[18px] !rounded-[50px]"
        aria-label="Main"
      >
        <button
          class="grid h-11 w-11 place-items-center"
          aria-label="Assistant"
          :aria-pressed="sheet === 'assistant'"
          @click="toggle('assistant')"
        >
          <span class="orb h-[30px] w-[30px]" />
        </button>
        <button
          v-for="item in dockItems"
          :key="item.label"
          class="grid h-11 w-11 place-items-center"
          :aria-label="item.label"
          :aria-pressed="item.sheet ? sheet === item.sheet : undefined"
          @click="toggle(item.sheet)"
        >
          <UIcon :name="item.icon" class="h-7 w-7" />
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSensorDetailStore } from '../../stores/sensorDetail'
import { useDashboardStore } from '../../stores/dashboard'
import { useMapStore } from '../../stores/map'
import MobileFilter from './MobileFilter.vue'

defineProps({
  locations: { type: Array, default: () => [] },
  dateRange: { type: Object, default: null },
})
const emit = defineEmits([
  'select-location',
  'filter-change',
  'reset',
  'download',
])

const sensorDetailStore = useSensorDetailStore()
const dashboardStore = useDashboardStore()
const mapStore = useMapStore()
const { sensors, filteredSensors, showSensorInfo } =
  storeToRefs(sensorDetailStore)

// 'welcome' | 'assistant' | 'list' | 'report' | 'filter' | 'menu' | null
const sheet = ref('welcome')

const dockItems = [
  { icon: 'i-heroicons-map', label: 'Map', sheet: null },
  { icon: 'i-heroicons-list-bullet', label: 'Sensors', sheet: 'list' },
  { icon: 'i-heroicons-information-circle', label: 'Report', sheet: 'report' },
  { icon: 'i-heroicons-ellipsis-horizontal', label: 'More', sheet: 'menu' },
]

function toggle(name) {
  sheet.value = sheet.value === name ? null : name
  if (sheet.value) sensorDetailStore.closeSensorInfo()
}

// A tapped pin shows its tag; get the sheet out of the way.
watch(showSensorInfo, (shown) => {
  if (shown) sheet.value = null
})

const toggleMapStyle = () =>
  mapStore.setMapType(mapStore.mapType === 'light' ? 'satellite' : 'light')

const mapStyleButton = {
  icon: 'i-heroicons-globe-americas',
  label: 'Toggle map style',
  action: toggleMapStyle,
}
const trays = {
  menu: [
    {
      icon: 'i-heroicons-clock',
      label: 'Filters',
      action: () => (sheet.value = 'filter'),
    },
    mapStyleButton,
    {
      icon: 'i-heroicons-arrow-down-tray',
      label: 'Download data',
      action: () => emit('download'),
    },
  ],
  filter: [
    mapStyleButton,
    {
      icon: 'i-heroicons-arrow-uturn-left',
      label: 'Reset filters',
      action: () => emit('reset'),
    },
  ],
}
const tray = computed(() => trays[sheet.value] ?? [])

function selectLocation(loc) {
  emit('select-location', [loc.location[0], loc.location[1]])
  sheet.value = null
}

function selectSensor(id) {
  sheet.value = null
  sensorDetailStore.updateSelectedSensor(id)
}

function openDashboard() {
  sheet.value = null
  dashboardStore.toggleDashboard()
}

// Same rule the map and dashboard use for "Inactive".
const isActive = (s) => !(s.temperature === 0 && s.relative_humidity === 0)

const reportCards = computed(() => {
  const active = sensors.value.filter(isActive)
  const avg = (key, unit) =>
    active.length
      ? Math.round(active.reduce((sum, s) => sum + s[key], 0) / active.length) +
        unit
      : '—'
  return [
    {
      title: 'Sensors',
      value: sensors.value.length,
      open: openDashboard,
      stats: [
        { label: 'Active', value: active.length },
        { label: 'Inactive', value: sensors.value.length - active.length },
      ],
    },
    {
      title: 'Climate',
      value: avg('temperature', '°'),
      stats: [
        { label: 'Humidity', value: avg('relative_humidity', '%') },
        { label: 'PM2.5', value: avg('pm25', '') },
      ],
    },
  ]
})

// Voice commands via the browser's SpeechRecognition (Chrome, Safari).
// ponytail: keyword matching, swap for a real intent parser if commands grow.
const listening = ref(false)
const heard = ref('')

function runCommand(text) {
  heard.value = `“${text}”`
  if (/vector|street/i.test(text)) mapStore.setMapType('light')
  else if (/satellite/i.test(text)) mapStore.setMapType('satellite')
  else if (/dashboard/i.test(text)) openDashboard()
  else if (/filter/i.test(text)) sheet.value = 'filter'
  else if (/report|overview/i.test(text)) sheet.value = 'report'
  else if (/sensor|list/i.test(text)) sheet.value = 'list'
  else heard.value += ' — sorry, I don’t know that one yet.'
}

function listen() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!Recognition) {
    heard.value = 'Voice input is not supported in this browser.'
    return
  }
  const recognition = new Recognition()
  recognition.lang = 'en-US'
  recognition.onresult = (e) => runCommand(e.results[0][0].transcript)
  recognition.onerror = () => (heard.value = 'Could not hear you — try again.')
  recognition.onend = () => (listening.value = false)
  listening.value = true
  recognition.start()
}
</script>

<style scoped>
.card {
  border-radius: 20px;
  background: #fafafa;
  box-shadow: 0 0 5px rgb(0 0 0 / 0.15);
}
.sheet {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 20px;
  pointer-events: auto;
}
.round {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border: 1px solid rgb(0 0 0 / 0.6);
  border-radius: 50%;
}
.bubble {
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 5px rgb(0 0 0 / 0.15);
}
.tag {
  border-radius: 50px;
  background: #4dd3ff;
  box-shadow: 0 0 5px rgb(0 0 0 / 0.15);
  padding: 8px 16px;
  font-size: 12px;
  letter-spacing: -0.002em;
}
.no-scrollbar {
  scrollbar-width: none;
}
.orb {
  display: block;
  border-radius: 50%;
  background: linear-gradient(60deg, #fff200 5%, #5cff3d 50%, #00e5a8 100%);
}
</style>
