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
    dbURL: process.env.NUXT_POSTGRES_URL,
    public: {
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    },
  },

  nitro: {
    preset: 'cloudflare-pages',
    cloudflare: {
      deployConfig: true, // ← tell Nitro to write a wrangler.toml for Pages
      nodeCompat: true, // ← polyfill node:buffer, etc. for your Worker
    },
    rollupConfig: {
      // still externalize postgres so it doesn’t try to bundle "cloudflare:sockets"
      external: ['postgres'],
    },
  },

  vite: {
    ssr: {
      external: [],
    },
  },

  compatibilityDate: '2025-05-15',
  plugins: [{ src: '~/plugins/vue3-openlayers.js', mode: 'client' }],
})
