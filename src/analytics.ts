import LogRocket from 'logrocket'

declare global {
  interface Window { dataLayer: any; ga: Function }
}

class AnalyticsManager {
  userId!: string

  constructor () {
    this.initializeUserId()
  }

  initializeAndIdentify () {
    this.initializeGA()
    LogRocket.init('e-mom/e-mom-website')
    LogRocket.identify(this.userId)
  }

  private initializeGA () {
    const gaScriptTag = document.createElement('script')
    gaScriptTag.async = true
    gaScriptTag.src = 'https://www.googletagmanager.com/gtag/js?id=G-FTQFGZ9V1R'
    document.body.appendChild(gaScriptTag)
    window.dataLayer = window.dataLayer || []
    function gtag () { window.dataLayer.push(arguments) }
    // @ts-ignore
    gtag('js', new Date())
    // @ts-ignore
    gtag('config', 'G-FTQFGZ9V1R', { user_id: this.userId })
  }

  private initializeUserId () {
    let userId = window.localStorage.getItem('userId')
    if (!userId) {
      userId = `${Math.random()}`.split('.')[1]
      window.localStorage.setItem('userId', userId)
    }
    this.userId = userId
  }

  sendAnalyticsEvent (eventName: string, options: {
    eventCategory?: string,
    eventAction?: string,
    eventLabel?: string
  } = {}) {
    if (window.ga) {
      const ga = window.ga
      ga('send', Object.assign(options, { hitType: 'event' }))
    }

    LogRocket.track(eventName)
  }
}

export default new AnalyticsManager()
