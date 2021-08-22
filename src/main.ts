import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { initAnalytics } from '@/analytics'

if (['production', 'staging'].includes(process.env.NODE_ENV!)) {
  initAnalytics()
}

Vue.config.productionTip = false

new Vue({
  router,
  store: store.original,
  render: h => h(App)
}).$mount('#app')
