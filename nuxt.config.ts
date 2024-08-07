// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // Global CSS
  css: [
    // '@/assets/less/antd.less', // Uncomment if you're using Ant Design
    'element-plus/dist/index.css', // Element Plus styles
  ],

  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },

  // Plugins to load before mounting the App
  plugins: [
    { src: '@/plugins/antd-ui', mode: 'client' }, // Keep this if you're using Ant Design
  ],

  // Modules
  modules: ['@pinia/nuxt', '@element-plus/nuxt'],

  // Auto-import components
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // Element Plus configuration
  elementPlus: {
    importStyle: 'css',
    themes: ['dark'],
  },

  // Runtime config
  runtimeConfig: {
    dbUser: process.env.DB_USER,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbPassword: process.env.DB_PASSWORD,
    dbPort: process.env.DB_PORT,
  },

  // Build configuration
  build: {
    transpile: ['element-plus/es'],
  },

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['element-plus'],
    },
  },
})
