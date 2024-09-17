import { describe, it, expect, vi, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Dashboard from '../Dashboard.vue'
import { useDashboardUIStore } from '../../../stores/dashboardUI'
import { nextTick } from 'vue'

const mockNuxtUI = {
  UCard: {
    template:
      '<div class="u-card"><slot></slot><slot name="header"></slot></div>',
  },
  UBadge: { template: '<span class="u-badge"><slot></slot></span>' },
  UIcon: { template: '<i class="u-icon"></i>' },
  UButton: { template: '<button class="u-button"><slot></slot></button>' },
}

describe('Dashboard', () => {
  const mountComponent = () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              dashboardUI: {
                sensors: [
                  {
                    id: '1',
                    status: 'Active',
                    timestamp: '2023-05-01T12:00:00Z',
                  },
                  {
                    id: '2',
                    status: 'Inactive',
                    timestamp: '2023-05-01T13:00:00Z',
                  },
                  {
                    id: '3',
                    status: 'Maintenance',
                    timestamp: '2023-05-01T14:00:00Z',
                  },
                ],
              },
            },
          }),
        ],
        components: {
          ...mockNuxtUI,
        },
        stubs: {
          DashboardHeader: true,
          OverviewContent: true,
          SensorTile: true,
        },
      },
    })
    const store = useDashboardUIStore()
    return { wrapper, store }
  }

  beforeAll(() => {
    process.env.TZ = 'UTC'
  })

  it('renders the dashboard layout correctly', async () => {
    const { wrapper } = mountComponent()
    await nextTick()

    expect(wrapper.find('.u-card').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'DashboardHeader' }).exists()).toBe(
      true
    )
    expect(wrapper.findComponent({ name: 'OverviewContent' }).exists()).toBe(
      true
    )
    expect(wrapper.findAllComponents({ name: 'SensorTile' })).toHaveLength(3)
  })

  it('computes lastUpdated correctly', async () => {
    vi.useFakeTimers()
    const testDate = new Date('2023-05-01T14:00:00Z')
    vi.setSystemTime(testDate)

    const { wrapper } = mountComponent()
    await nextTick()

    const headerComponent = wrapper.findComponent({ name: 'DashboardHeader' })
    expect(headerComponent.exists()).toBe(true)

    const expectedDateString = testDate.toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })

    const expectedBadgeText = `Last updated: ${expectedDateString}`
    expect(headerComponent.props('badgeText')).toBe(expectedBadgeText)

    vi.useRealTimers()
  })

  it('computes overviewStats correctly', async () => {
    const { wrapper } = mountComponent()
    await nextTick()

    const overviewComponent = wrapper.findComponent({ name: 'OverviewContent' })
    expect(overviewComponent.exists()).toBe(true)
    const stats = overviewComponent.props('stats')
    expect(stats).toContainEqual({ value: 1, label: 'Active Sensors' })
    expect(stats).toContainEqual({ value: 4, label: 'Measured Values' })
    expect(stats).toContainEqual({ value: 1, label: 'Pending Issues' })
  })

  it('calls openSensorDetail when a sensor tile is clicked', async () => {
    const { wrapper, store } = mountComponent()
    await nextTick()

    const sensorTile = wrapper.findComponent({ name: 'SensorTile' })
    await sensorTile.vm.$emit('open-details', '1')

    expect(store.updateSelectedSensor).toHaveBeenCalledWith('1')
    expect(store.toggleSensorDetail).toHaveBeenCalled()
  })

  it('applies custom colors to sensor tiles', async () => {
    const { wrapper } = mountComponent()
    await nextTick()

    const sensorTile = wrapper.findComponent({ name: 'SensorTile' })
    expect(sensorTile.props('customColors')).toEqual({
      status: {
        Active: 'green',
        Inactive: 'red',
        Maintenance: 'yellow',
      },
      battery: {
        low: 'text-red-500',
        medium: 'text-yellow-500',
        high: 'text-green-500',
      },
      values: {
        temperature: {
          '0-15': 'text-blue-500',
          '16-25': 'text-green-500',
          '26-100': 'text-red-500',
        },
        humidity: {
          '0-30': 'text-yellow-500',
          '31-70': 'text-green-500',
          '71-100': 'text-blue-500',
        },
      },
    })
  })
})
