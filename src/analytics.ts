import LogRocket from 'logrocket'
import api from './api'
import { GOOGLE_ANALYTICS_KEY, LOG_ROCKET_APP } from './config'

function initLogRocket () {
  LogRocket.init(LOG_ROCKET_APP)
}

declare global {
  interface Window { dataLayer: any; }
}

window.dataLayer = window.dataLayer || {}

function initGA () {
  const gaScriptTag = document.createElement('script')
  gaScriptTag.async = true
  gaScriptTag.src = 'https://www.googletagmanager.com/gtag/js?id=G-KGERYQRF9N'
  document.body.appendChild(gaScriptTag)
  window.dataLayer = window.dataLayer || []
  function gtag () { window.dataLayer.push(arguments) }
  // @ts-ignore
  gtag('js', new Date())
  // @ts-ignore
  gtag('config', GOOGLE_ANALYTICS_KEY)
}

export function initAnalytics () {
  initLogRocket()
  // initGA()
}

export async function identifyUser () {
  const { id, display_name } = await api.getUserInfo()
  LogRocket.identify(id, {
    name: display_name || 'unknown'
  })
}
