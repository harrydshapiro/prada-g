import LogRocket from 'logrocket'

function initLogRocket () {
  LogRocket.init(process.env.LOG_ROCKET_APP || '')
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
  gtag('config', process.env.GOOGLE_ANALYTICS_KEY)
}

export function initAnalytics () {
  initLogRocket()
  // initGA()
}

export async function identifyUser () {
  // const { id, display_name } = await api.getUserInfo()
  // LogRocket.identify(id, {
  //   name: display_name || 'unknown'
  // })
}
