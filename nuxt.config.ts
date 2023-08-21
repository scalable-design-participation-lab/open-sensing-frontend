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
    {src:'@/plugins/antd-ui', mode: 'client'},
  ],

})
