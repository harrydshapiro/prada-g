<template>
  <div class="music">
    <Spines
      :media="leftMedia"
      :text-baseline="'left'"
      @selectSpine="selectSpine"
    />
    <RecordCover
      :album="currentMedia"
    />
    <Spines
      :media="rightMedia"
      :text-baseline="'right'"
      @selectSpine="selectSpine"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import store, { AlbumFilterMethod, AlbumSortMethod } from '@/store'
import Spines from '@/components/Spines.vue'
import RecordCover from '@/components/RecordCover.vue'
import hotkeys from 'hotkeys-js'

@Component({
  components: {
    Spines,
    RecordCover
  }
})
export default class Music extends Vue {
  currentSpineIndex = 0

  async mounted () {
    this.initializeHotkeys()

    const currentURI = store.state.currentPlayerURI
    if (currentURI) {
      const uriToJumpTo = this.media.findIndex(album => album.uri === currentURI)
      if (uriToJumpTo !== -1) this.currentSpineIndex = uriToJumpTo
    }
  }

  get media () {
    return store.getters.albumsAndPlaylistsInView
  }

  get leftMedia () {
    return this.media.slice(0, this.currentSpineIndex)
  }

  get rightMedia () {
    return this.media.slice(this.currentSpineIndex + 1)
  }

  get currentMedia () {
    return this.media[this.currentSpineIndex]
  }

  initializeHotkeys () {
    hotkeys('left', (event, handler) => {
      event.preventDefault()
      this.currentSpineIndex = Math.max(0, this.currentSpineIndex - 1)
    })

    hotkeys('right', (event, handler) => {
      event.preventDefault()
      this.currentSpineIndex = Math.min(this.media.length - 1, this.currentSpineIndex + 1)
    })

    hotkeys('shift+left', (event, handler) => {
      event.preventDefault()
      this.currentSpineIndex = 0
    })

    hotkeys('shift+right', (event, handler) => {
      event.preventDefault()
      this.currentSpineIndex = this.media.length - 1
    })

    hotkeys('a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z', (event, handler) => {
      const { key } = handler
      if (store.state.albumSortMethod === AlbumSortMethod.ArtistName) {
        const firstMatchingAlbumIndex = this.media.findIndex(album => {
          const artistFirstLetter = album.artists[0].name[0].toLowerCase()
          return artistFirstLetter >= key
        })
        const indexToJumpTo = firstMatchingAlbumIndex === -1 ? this.media.length - 1 : firstMatchingAlbumIndex
        this.currentSpineIndex = indexToJumpTo
      }
    })

    hotkeys('shift+s', (event, handler) => {
      if (store.state.albumSortMethod !== AlbumSortMethod.Random) {
        store.dispatch.changeAlbumSorting(AlbumSortMethod.Random)
      } else {
        store.dispatch.changeAlbumSorting(AlbumSortMethod.ArtistName)
      }
    })

    hotkeys('shift+a', (event, handler) => {
      if (store.state.albumFilterMethod !== AlbumFilterMethod.Album) {
        store.dispatch.changeAlbumFiltering(AlbumFilterMethod.Album)
      } else {
        store.dispatch.changeAlbumFiltering(AlbumFilterMethod.All)
      }
    })

    hotkeys('shift+p', (event, handler) => {
      if (store.state.albumFilterMethod !== AlbumFilterMethod.Playlist) {
        store.dispatch.changeAlbumFiltering(AlbumFilterMethod.Playlist)
      } else {
        store.dispatch.changeAlbumFiltering(AlbumFilterMethod.All)
      }
    })
  }

  selectSpine (albumId: string) {
    const albumIndex = this.media.findIndex(album => album.id === albumId)
    if (albumIndex !== -1) this.currentSpineIndex = albumIndex
  }
}
</script>

<style lang="scss">
.music {
  display: flex;
  width: 100vw;
}
</style>
