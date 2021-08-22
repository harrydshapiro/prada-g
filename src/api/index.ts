import SpotifyRequester from '@/api/spotifyRequester'

async function getAndUnpackAllPageObjects <MediaType> (url: string): Promise<MediaType[]> {
  const allResults: MediaType[] = []

  const { items, total, limit } = await SpotifyRequester.sendRequest<SpotifyApi.PagingObject<MediaType>>('GET', url)

  allResults.push(...items)

  const additionalRequests: Promise<SpotifyApi.PagingObject<MediaType>>[] = []

  for (let i = items.length; i < total; i += limit) {
    additionalRequests.push(SpotifyRequester.sendRequest<SpotifyApi.PagingObject<MediaType>>('GET', `${url}?offset=${i}`))
  }

  const additionalPagingObjects = await Promise.allSettled(additionalRequests) as PromiseFulfilledResult<SpotifyApi.PagingObject<MediaType>>[]

  additionalPagingObjects.forEach(pagingObject => {
    const { items } = pagingObject.value
    allResults.push(...items)
  })

  return allResults
}

export default {
  async getAllUserAlbums () {
    const albumItems = await getAndUnpackAllPageObjects<{ added_at: string, album: SpotifyApi.AlbumObjectFull }>('/me/albums')
    const albums = albumItems.map(({ album }) => album)
    return albums
  },

  async getAllUserPlaylists () {
    const playlists = await getAndUnpackAllPageObjects<SpotifyApi.PlaylistObjectSimplified>('/me/playlists')
    return playlists
  },

  async transferPlayback (deviceId: string) {
    return await SpotifyRequester.sendRequest('PUT', '/me/player', {
      device_ids: [deviceId]
    })
  },

  async playPlayback (deviceId: string, contextURI?: string) {
    const path = `/me/player/play?device_id=${deviceId}`
    return await SpotifyRequester.sendRequest('PUT', path, {
      context_uri: contextURI
    })
  },

  async pausePlayback (deviceId: string) {
    const path = `/me/player/pause?device_id=${deviceId}`
    return await SpotifyRequester.sendRequest('PUT', path)
  },

  async getUserInfo () {
    return await SpotifyRequester.sendRequest('get', '/me') as SpotifyApi.UserObjectPrivate
  }
}
