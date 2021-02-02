import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import i18n from 'vue-plugin-webextension-i18n'

Vue.use(i18n)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
