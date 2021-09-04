import LogRocket from 'logrocket'

function initLogRocket () {
  LogRocket.init('e-mom/e-mom-website')
}

declare global {
  interface Window { dataLayer: any; }
}

window.dataLayer = window.dataLayer || []

function initGA () {
  const gaScriptTag = document.createElement('script')
  gaScriptTag.async = true
  gaScriptTag.src = 'https://www.googletagmanager.com/gtag/js?id=G-FTQFGZ9V1R'
  document.body.appendChild(gaScriptTag)
  window.dataLayer = window.dataLayer || []
  function gtag () {
    console.log('adding to datalayer')
    window.dataLayer.push(arguments)
  }
  // @ts-ignore
  gtag('js', new Date())
  // @ts-ignore
  gtag('config', 'G-FTQFGZ9V1R')
}

export function initAnalytics () {
  initLogRocket()
  initGA()
}

export async function identifyUser () {
  // const { id, display_name } = await api.getUserInfo()
  // LogRocket.identify(id, {
  //   name: display_name || 'unknown'
  // })
}
