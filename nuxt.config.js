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
    dbURL: process.env.DB_URL,
    public: {
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    },
  },

  nitro: {
    preset: 'cloudflare_workers',
    compatibilityDate: '2024-09-23', // Cloudflare compatibility date
    cloudflare: {
      nodeCompat: true, // enable Node.js polyfills (e.g. TCP sockets)
      deployConfig: true, // auto-generate wrangler config
    },
    rollupConfig: {
      // (optional) mark some imports as external to reduce bundle size
      external: ['cloudflare:sockets'],
    },
  },

  vite: {
    ssr: {
      // Prevent Vite’s SSR build from crawling it, too
      external: ['postgres', /^postgres\/.*/],
    },
  },

  compatibilityDate: '2024-09-23',
  plugins: [{ src: '~/plugins/vue3-openlayers.js', mode: 'client' }],
})
