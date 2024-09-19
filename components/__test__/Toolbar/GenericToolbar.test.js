import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GenericToolbar from '../../Toolbar/GenericToolbar.vue'

// Mock NuxtUI components
vi.mock('#components', () => ({
  UButton: {
    name: 'UButton',
    template: '<button><slot /></button>',
  },
  UIcon: {
    name: 'UIcon',
    template: '<i><slot /></i>',
  },
}))

describe('GenericToolbar', () => {
  const mockTools = [
    { icon: 'i-heroicons-pencil', tooltip: 'Edit', action: vi.fn() },
    { icon: 'i-heroicons-trash', tooltip: 'Delete', action: vi.fn() },
  ]

  it('renders the correct number of tool buttons', () => {
    const wrapper = mount(GenericToolbar, {
      props: {
        tools: mockTools,
      },
    })
    expect(wrapper.findAll('.w-14.h-14').length).toBe(mockTools.length)
  })

  it('emits toolClick event when a tool button is clicked', async () => {
    const wrapper = mount(GenericToolbar, {
      props: {
        tools: mockTools,
      },
    })
    await wrapper.findAll('.w-14.h-14')[0].trigger('click')
    expect(wrapper.emitted('toolClick')).toBeTruthy()
    expect(wrapper.emitted('toolClick')[0]).toEqual([0])
  })

  it('executes the corresponding action when a tool button is clicked', async () => {
    const wrapper = mount(GenericToolbar, {
      props: {
        tools: mockTools,
      },
    })
    await wrapper.findAll('.w-14.h-14')[0].trigger('click')
    expect(mockTools[0].action).toHaveBeenCalled()
  })

  it('toggles active state when clicking the same tool button twice', async () => {
    const wrapper = mount(GenericToolbar, {
      props: {
        tools: mockTools,
      },
    })
    const button = wrapper.findAll('.w-14.h-14')[0]
    await button.trigger('click')
    expect(button.classes()).toContain('bg-blue-500')
    await button.trigger('click')
    expect(button.classes()).not.toContain('bg-blue-500')
  })

  it('renders the component structure correctly', () => {
    const wrapper = mount(GenericToolbar, {
      props: {
        tools: mockTools,
      },
    })
    expect(wrapper.find('.flex.flex-col').exists()).toBe(true)
  })
})
