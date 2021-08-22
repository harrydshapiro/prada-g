const getEnvVariable = (name: string, required = false, defaultValue?: string) => {
  const variable = process.env[name]
  if (!variable && required) {
    if (!defaultValue && defaultValue !== '') {
      throw new Error(`Could not find env variable ${name}`)
    } else {
      return defaultValue
    }
  }
  return variable
}

export const SPOTIFY_CLIENT_ID = getEnvVariable('VUE_APP_SPOTIFY_CLIENT_ID', true) as string
export const SPOTIFY_CLIENT_SECRET = getEnvVariable('VUE_APP_SPOTIFY_CLIENT_SECRET', true) as string
export const SPOTIFY_REDIRECT_URI = getEnvVariable('VUE_APP_SPOTIFY_REDIRECT_URI', true) as string
export const LOG_ROCKET_APP = getEnvVariable('VUE_APP_LOG_ROCKET_APP', false, '') as string
export const GOOGLE_ANALYTICS_KEY = getEnvVariable('VUE_APP_GOOGLE_ANALYTICS_KEY', false, '') as string
