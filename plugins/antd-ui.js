// import Vue from 'vue'
import Antd from 'ant-design-vue/lib'
import 'ant-design-vue/dist/reset.css'

// export default () => {
//   Vue.use(Antd)
// }

export default defineNuxtPlugin(nuxtApp => {
  // Doing something with nuxtApp
  nuxtApp.vueApp.use(Antd)
})