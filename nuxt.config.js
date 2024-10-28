const { defineNuxtConfig } = require('nuxt/config')

export default defineNuxtConfig({
  css: ['vue3-openlayers/dist/vue3-openlayers.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  extends: ['@nuxt/ui-pro'],

  modules: ['@pinia/nuxt', '@nuxt/ui', 'nuxt-vuefire'],

  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
    admin: {
      serviceAccount: {
        type: process.env.FIRESTORE_TYPE,
        project_id: process.env.FIRESTORE_PROJECT_ID,
        private_key_id: process.env.FIRESTORE_PRIVATE_KEY_ID,
        private_key: process.env.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIRESTORE_CLIENT_EMAIL,
        client_id: process.env.FIRESTORE_CLIENT_ID,
        auth_uri: process.env.FIRESTORE_AUTH_URI,
        token_uri: process.env.FIRESTORE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIRESTORE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIRESTORE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.FIRESTORE_UNIVERSE_DOMAIN
      }
    },
    useAuth: true
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  compatibilityDate: '2024-08-15',
  plugins: [{ src: '~/plugins/vue3-openlayers.js', mode: 'client' }],
})