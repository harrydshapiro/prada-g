import axios, { AxiosRequestConfig } from 'axios'
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI
} from '@/config'

export interface ISpotifyApiOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class SpotifyConnection {
  clientId!: string;
  clientSecret!: string;
  redirectUri!: string;
  accessToken: string | null = null;
  refreshToken: string | null = null;
  code: string | null = null;

  constructor ({ clientId, clientSecret, redirectUri }: ISpotifyApiOptions) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectUri = redirectUri
  }

  async sendRequest<T> (
    method: AxiosRequestConfig['method'],
    relativePath: string,
    data?: any
  ): Promise<T> {
    const options: any = {
      method,
      url: `https://api.spotify.com/v1${relativePath}`,
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      },
      data
    }
    if (typeof data === 'object') { options.headers['Content-Type'] = 'application/json' }
    try {
      const { data } = await axios(options)
      return data as unknown as T
    } catch {
      await this.updateAccessToken()
    }
    try {
      const { data } = await axios(options)
      return data as unknown as T
    } catch (err) {
      console.error('Unresolvable error when sending request to spotify', err)
      return null as unknown as T
    }
  }

  async updateAccessToken () {
    const authHeader = `Basic ${Buffer.from(
      this.clientId + ':' + this.clientSecret
    ).toString('base64')}`
    const requestData = `refresh_token=${this.refreshToken}&grant_type=refresh_token`
    const {
      data: { accessToken }
    } = await axios({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: requestData
    })
    this.accessToken = accessToken
  }

  redirectToLogin () {
    window.location.replace(
      `https://accounts.spotify.com/authorize?client_id=${
        this.clientId
      }&response_type=code&redirect_uri=${encodeURIComponent(
        this.redirectUri
      )}&scope=user-library-read%20user-modify-playback-state%20streaming%20user-read-currently-playing%20user-read-playback-state%20user-read-email%20user-read-private%20playlist-read-private%20playlist-modify-public%20playlist-modify-private%20playlist-read-collaborative`
    )
  }

  async fetchTokens (code: string) {
    if (this.accessToken || this.refreshToken) return

    const tokenRequestData = `grant_type=authorization_code&code=${code}&redirect_uri=${SPOTIFY_REDIRECT_URI}`
    const headers = {
      Authorization:
        'Basic ' +
        Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString(
          'base64'
        ),
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    const {
      data: { access_token: accessToken, refresh_token: refreshToken }
    } = await axios({
      method: 'POST',
      data: tokenRequestData,
      headers,
      url: 'https://accounts.spotify.com/api/token'
    })
    if (accessToken && refreshToken) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    }
  }
}

export default new SpotifyConnection({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  redirectUri: SPOTIFY_REDIRECT_URI
})
