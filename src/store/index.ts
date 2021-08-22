import Vue from 'vue'
import Vuex from 'vuex'
import { createDirectStore } from 'direct-vuex'
import { merge, cloneDeep } from 'lodash-es'
import api from '@/api'
import { identifyUser } from '@/analytics'
import { SanitizedMedia, SanitizedPlaylist } from '@/types/sanitizedMedia'

export enum AlbumSortMethod {
  AlbumName,
  ArtistName,
  DateReleased,
  Random
}

export enum AlbumFilterMethod {
  All,
  Album,
  Playlist
}
export interface RootState {
  albums: Record<SpotifyApi.AlbumObjectFull['id'], SpotifyApi.AlbumObjectFull>,
  playlists: Record<SanitizedPlaylist['id'], SanitizedPlaylist>,
  player: Spotify.SpotifyPlayer | null,
  playerDeviceId: string | null,
  playerPaused: boolean,
  currentPlayerURI: string | null,
  albumSortMethod: AlbumSortMethod,
  albumSortDirection: 'ascending' | 'descending',
  albumFilterMethod: AlbumFilterMethod
}

Vue.use(Vuex)

const state: RootState = {
  albums: {},
  player: null,
  playerDeviceId: null,
  playerPaused: true,
  currentPlayerURI: null,
  albumSortMethod: AlbumSortMethod.ArtistName,
  albumSortDirection: 'descending',
  albumFilterMethod: AlbumFilterMethod.All
} as RootState // You have to cast it here else it complains about not having a user property initialization... however vuex composes the submodules itself so you can't actually provide a def

const {
  store,
  rootActionContext,
  moduleActionContext,
  rootGetterContext,
  moduleGetterContext
} = createDirectStore({
  state,
  modules: {
  },
  mutations: {
    addAlbums (state, albums: SpotifyApi.AlbumObjectFull[]) {
      const newAlbumsObj = albums.reduce<Record<SpotifyApi.AlbumObjectFull['id'], SpotifyApi.AlbumObjectFull>>((acc, curr) => {
        acc[curr.id] = curr
        return acc
      }, {})
      state.albums = merge({}, state.albums, newAlbumsObj)
    },
    addPlaylists (state, playlists: SpotifyApi.PlaylistObjectSimplified[]) {
      const newPlaylistsObj = playlists.reduce<Record<SpotifyApi.PlaylistObjectSimplified['id'], SpotifyApi.PlaylistObjectSimplified>>((acc, curr) => {
        acc[curr.id] = curr
        return acc
      }, {})
      state.playlists = merge({}, state.playlists, newPlaylistsObj)
    },
    setPlayer (state, player: Spotify.SpotifyPlayer) {
      state.player = player
    },
    setPlayerDeviceId (state, playerDeviceId: string) {
      state.playerDeviceId = playerDeviceId
    },
    setPlayerPaused (state, pausedState: boolean) {
      state.playerPaused = pausedState
    },
    setCurrentPlayerURI (state, uri: string | null) {
      state.currentPlayerURI = uri
    },
    setAlbumSorting (state, sortMethod: AlbumSortMethod) {
      state.albumSortMethod = sortMethod
    },
    setAlbumFilter (state, filterMethod: AlbumFilterMethod) {
      state.albumFilterMethod = filterMethod
    }
  },
  actions: {
    async getMusic (context) {
      const { dispatch } = rootActionContext(context)
      dispatch.getUserAlbums()
      dispatch.getUserPlaylists()
    },

    async getUserAlbums (context) {
      const { commit } = rootActionContext(context)
      const albums = await api.getAllUserAlbums()
      commit.addAlbums(albums)
    },

    async getUserPlaylists (context) {
      const { commit } = rootActionContext(context)
      const rawPlaylists = await api.getAllUserPlaylists()
      const playlists = rawPlaylists.map((playlist) => {
        const newPlaylist: SanitizedPlaylist = {
          ...playlist,
          artists: [{ name: 'ž' }]
        }
        return newPlaylist
      })
      commit.addPlaylists(playlists)
    },

    async addPlayer (context, player: Spotify.SpotifyPlayer) {
      const { commit, dispatch } = rootActionContext(context)

      commit.setPlayer(player)

      player.addListener('initialization_error', ({ message }: any) => {
        console.error(message)
      })
      player.addListener('authentication_error', ({ message }: any) => {
        console.error(message)
      })
      player.addListener('account_error', ({ message }: any) => {
        console.error(message)
      })
      player.addListener('playback_error', ({ message }: any) => {
        console.error('PLAYBACK ERROR OY VEY!', message)
      })

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id)
        dispatch.transferPlaybackToWebPlayer(device_id)
        identifyUser()
      })

      player.addListener('player_state_changed', (message) => {
        console.log('Player state changed:', message)

        commit.setPlayerPaused(message.paused)
        commit.setCurrentPlayerURI(message.context.uri)
      })

      player.addListener('not_ready', ({ device_id }: any) => {
        console.log('Device ID has gone offline', device_id)
      })

      await player.connect()
    },

    async transferPlaybackToWebPlayer (context, deviceId: string) {
      const { commit } = rootActionContext(context)
      commit.setPlayerDeviceId(deviceId)
      await api.transferPlayback(deviceId)
    },

    async togglePlayState (context, uri: string) {
      const { playerDeviceId, currentPlayerURI } = store.state
      if (!playerDeviceId) return

      if (!store.state.playerPaused && currentPlayerURI !== uri) {
        // If music is playing and you switch albums
        await api.playPlayback(playerDeviceId, uri)
      } else if (!store.state.playerPaused && currentPlayerURI === uri) {
        // If music is playing and you pause the current album
        await api.pausePlayback(playerDeviceId)
      } else if (store.state.playerPaused && currentPlayerURI === uri) {
        // If music is paused and you replay current album
        await api.playPlayback(playerDeviceId)
      } else if (store.state.playerPaused && currentPlayerURI !== uri) {
        // If music is paused and you play new album
        await api.playPlayback(playerDeviceId, uri)
      }
    },

    changeAlbumSorting (context, sortMethod: AlbumSortMethod) {
      const { commit } = rootActionContext(context)
      commit.setAlbumSorting(sortMethod)
    },

    changeAlbumFiltering (context, filterMethod: AlbumFilterMethod) {
      const { commit } = rootActionContext(context)
      commit.setAlbumFilter(filterMethod)
    }
  },
  getters: {
    albumsAndPlaylistsInView (state): SanitizedMedia[] {
      const playlists = (state.playlists && Object.values(state.playlists)) || []
      const albums = (state.albums && Object.values(state.albums)) || []
      let sortedAlbums: SanitizedMedia[] = [...playlists, ...albums]
      switch (state.albumSortMethod) {
        case AlbumSortMethod.AlbumName:
          sortedAlbums = sortedAlbums.sort((albumA, albumB) => {
            if (albumA.name > albumB.name) return 1
            else return -1
          })
          break
        case AlbumSortMethod.ArtistName:
          sortedAlbums = sortedAlbums.sort((albumA, albumB) => {
            if (albumA.type === 'playlist') return 1
            else if (albumB.type === 'playlist') return -1
            else if (albumA.artists[0].name > albumB.artists[0].name) return 1
            else return -1
          })
          break
        case AlbumSortMethod.DateReleased:
          sortedAlbums = sortedAlbums.sort((albumA, albumB) => {
            if (albumA.type === 'playlist') return 1
            else if (albumB.type === 'playlist') return -1
            else return new Date(albumA.release_date).getMilliseconds() - new Date(albumB.release_date).getMilliseconds()
          })
          break
        case AlbumSortMethod.Random:
          sortedAlbums = sortedAlbums.sort(() => Math.random() - 0.5)
          break
      }
      const filteredAlbums = sortedAlbums.filter(album => {
        if (state.albumFilterMethod === AlbumFilterMethod.Album) {
          return album.type === 'album'
        } else if (state.albumFilterMethod === AlbumFilterMethod.Playlist) {
          return album.type === 'playlist'
        } else {
          return true
        }
      })
      return filteredAlbums
    }
  }
})

// Export the direct-store instead of the classic Vuex store.
export default store

// The following exports will be used to enable types in the
// implementation of actions.
export { rootActionContext, moduleActionContext, rootGetterContext, moduleGetterContext }

// The following lines enable types in the injected store '$store'.
export type AppStore = typeof store
declare module 'vuex' {
  interface Store<S> {
    direct: AppStore
  }
}
