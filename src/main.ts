import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { initAnalytics } from '@/analytics'
import { parseQS } from '@/helpers'
import webPlayerSetup from '@/helpers/webPlayerSetup'
import SpotifyRequester from '@/api/spotifyRequester'

(async function () {
  if (['production', 'staging'].includes(process.env.NODE_ENV!)) {
    initAnalytics()
  }

  Vue.config.productionTip = false

  if (!SpotifyRequester.accessToken || !SpotifyRequester.refreshToken) {
    if (window.location.pathname !== '/code-redirect') {
      SpotifyRequester.redirectToLogin()
    } else {
      // TODO: show a 404 page to prevent infinite loop
    }
  }

  const { code } = parseQS()
  await SpotifyRequester.fetchTokens(code)
  webPlayerSetup(SpotifyRequester.accessToken!, store.dispatch.addPlayer)

  new Vue({
    router,
    store: store.original,
    render: h => h(App)
  }).$mount('#app')
})()
