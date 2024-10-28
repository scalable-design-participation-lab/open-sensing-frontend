export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    classSuffix: '',
  },
})
