// nuxt.config.js
const { defineNuxtConfig } = require('nuxt/config')

module.exports = defineNuxtConfig({
  css: ['vue3-openlayers/dist/vue3-openlayers.css'],
  postcss: {
    plugins: { tailwindcss: {}, autoprefixer: {} },
  },

  modules: ['@pinia/nuxt', '@nuxt/ui'],
  icon: {
    clientBundle: { scan: true, sizeLimitKb: 256 },
  },
  components: [{ path: '~/components', pathPrefix: false }],

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
    preset: 'cloudflare-worker',
    bundler: 'esbuild',
    externals: {
      // This is the new Nitro‐native externals API
      external: [
        'postgres', // exact package
        /^postgres\/.*/, // anything under postgres/*
      ],
      // inline: [],         // you can leave inline empty
    },
    // legacy Rollup config (harmless if you leave it in sync)
    rollupConfig: {
      external: ['postgres', /^postgres\/.*/],
    },
  },

  vite: {
    ssr: {
      // Prevent Vite’s SSR build from crawling it, too
      external: ['postgres', /^postgres\/.*/],
    },
  },

  compatibilityDate: '2024-09-15',
  plugins: [{ src: '~/plugins/vue3-openlayers.js', mode: 'client' }],
})
