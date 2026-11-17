import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MobileUI from '../../Mobile/MobileUI.vue'
import { useSensorDetailStore } from '../../../stores/sensorDetail'
import { useMapStore } from '../../../stores/map'

const sensor = (id, location, temperature, relative_humidity) => ({
  moduleid: id,
  ecohub_location: location,
  lat: 42.34,
  lon: -71.09,
  temperature,
  relative_humidity,
  pm25: 5,
  timestamp: new Date().toISOString(),
})

const createWrapper = () => {
  setActivePinia(createPinia())
  const store = useSensorDetailStore()
  store.sensors = [
    sensor('a', 'Cargill Hall', 22.4, 45),
    sensor('b', 'Snell Library Quad', 0, 0), // inactive
  ]
  store.filteredLocations = ['Cargill Hall', 'Snell Library Quad']
  const wrapper = mount(MobileUI, {
    props: {
      locations: [{ label: 'Boston', value: 0, location: [-71.09, 42.34] }],
    },
    global: { stubs: { UIcon: { template: '<i />', props: ['name'] } } },
  })
  return { wrapper, store }
}

const dock = (wrapper, label) => wrapper.find(`nav [aria-label="${label}"]`)

describe('MobileUI', () => {
  beforeEach(() => {
    delete window.SpeechRecognition
    delete window.webkitSpeechRecognition
  })

  it('opens on the welcome sheet and jumps to a location', async () => {
    const { wrapper } = createWrapper()
    await wrapper.find('[data-testid="welcome"] .tag').trigger('click')
    expect(wrapper.emitted('select-location')[0]).toEqual([[-71.09, 42.34]])
    expect(wrapper.find('[data-testid="welcome"]').exists()).toBe(false)
  })

  it('lists filtered sensors and selects one', async () => {
    const { wrapper, store } = createWrapper()
    await dock(wrapper, 'Sensors').trigger('click')
    const rows = wrapper.findAll('[data-testid="sensor-list"] button')
    expect(rows.map((r) => r.text())).toEqual([
      expect.stringContaining('22.4°C · 45% humidity'),
      expect.stringContaining('Inactive'),
    ])
    await rows[0].trigger('click')
    expect(store.selectedSensorId).toBe('a')
    expect(wrapper.find('[data-testid="sensor-list"]').exists()).toBe(false)
  })

  it('reports sensor counts and averages over active sensors only', async () => {
    const { wrapper } = createWrapper()
    await dock(wrapper, 'Report').trigger('click')
    const text = wrapper.text()
    expect(text).toContain('Sensors2Active1Inactive1')
    expect(text).toContain('Climate22°Humidity45%PM2.55')
  })

  it('runs a voice command through SpeechRecognition', async () => {
    window.webkitSpeechRecognition = class {
      start() {
        this.onresult({
          results: [[{ transcript: 'change the map style to vector' }]],
        })
        this.onend()
      }
    }
    const { wrapper } = createWrapper()
    const mapStore = useMapStore()
    await dock(wrapper, 'Assistant').trigger('click')
    await wrapper.find('[aria-label="Start voice command"]').trigger('click')
    expect(mapStore.mapType).toBe('light')
  })

  it('emits filter changes, reset and download from the menu', async () => {
    const { wrapper } = createWrapper()
    await dock(wrapper, 'More').trigger('click')
    await wrapper.find('[aria-label="Download data"]').trigger('click')
    expect(wrapper.emitted('download')).toHaveLength(1)

    await wrapper.find('[aria-label="Filters"]').trigger('click')
    await wrapper.find('input[type="checkbox"]').trigger('change')
    expect(wrapper.emitted('filter-change')[0]).toEqual([
      {
        name: 'location',
        value: { 'Cargill Hall': false, 'Snell Library Quad': true },
      },
    ])
    await wrapper.find('[aria-label="Reset filters"]').trigger('click')
    expect(wrapper.emitted('reset')).toHaveLength(1)
  })
})
