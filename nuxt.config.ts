// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  /*
   ** Global CSS
   */
  css: [
    // css files
    // '@/assets/less/antd.less',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    // '@/plugins/_',
    { src: '@/plugins/antd-ui', mode: 'client' },
  ],

  modules: [
    // ...
    '@pinia/nuxt',
  ],

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
  },

  // Element
  // modules: ['@element-plus/nuxt'],
})
