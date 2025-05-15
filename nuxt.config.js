const { defineNuxtConfig } = require('nuxt/config')

module.exports = defineNuxtConfig({
  css: ['vue3-openlayers/dist/vue3-openlayers.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ['@pinia/nuxt', '@nuxt/ui'],
  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  runtimeConfig: {
    dbUser: process.env.DB_USER,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPassword: process.env.DB_PASSWORD,
    dbPort: process.env.DB_PORT,
    public: {
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    },
  },
  nitro: {
    rollupConfig: {
      external: ['postgres', '/^postgres/.*/'],
    },
    preset: 'cloudflare',
    externals: {
      external: [],
    },
  },
  compatibilityDate: '2024-09-15',
  plugins: [{ src: '~/plugins/vue3-openlayers.js', mode: 'client' }],
  vite: {
    ssr: {
      // also ensure Vite’s SSR bundler leaves it alone
      external: ['postgres', /^postgres\/.*/],
    },
  },
})
