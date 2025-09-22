import { defineStore } from 'pinia'

type AQIResponse = {
  moduleId: string
  aqi: number | null
  category: string | null
  color: string | null
  pollutant: string | null
  generatedAt: string
}

export const useAqiStore = defineStore('aqi', {
  state: () => ({
    byModule: {} as Record<string, AQIResponse | undefined>,
    loading: false as boolean,
    error: null as string | null,
  }),
  actions: {
    async fetchAQI(moduleId: string): Promise<AQIResponse | undefined> {
      this.loading = true
      this.error = null
      try {
        if (this.byModule[moduleId]) {
          return this.byModule[moduleId]
        }
        const data = await $fetch<AQIResponse>('/api/aqi', {
          params: { moduleId },
        })
        this.byModule[moduleId] = data
        return data
      } catch (e: any) {
        this.error = e?.message ?? 'Failed to load AQI'
        return undefined
      } finally {
        this.loading = false
      }
    },
  },
  getters: {
    getAQI:
      (state) =>
      (moduleId: string): AQIResponse | undefined =>
        state.byModule[moduleId],
  },
})
