<template>
  <div class="nav">
    <div v-if="currentRouteName !== 'About'" class="about-toggle" @click="showAboutScreen">
      ?
    </div>
    <div v-if="currentRouteName !== 'Music'" class="music-toggle" @click="showMusicScreen">
      music
    </div>
    <!-- <div class="play-pause-toggle" @click="toggleAudioPlayback">
      {{ playerPaused ? 'play' : 'pause' }}
    </div>
    <div class="shuffle-toggle" @click="toggleShuffle">
      {{ shuffled ? 'by\nartist' : 'shuffle' }}
    </div> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import store, { AlbumSortMethod } from '@/store'
import router from '@/router'

@Component({})
export default class Nav extends Vue {
  showAboutScreen () {
    this.$router.push({
      name: 'About'
    })
  }

  showMusicScreen () {
    this.$router.push({
      name: 'Music'
    })
  }

  toggleAudioPlayback () {
    const currentUri = store.state.currentPlayerURI
    const uriToPlay = currentUri || store.getters.albumsAndPlaylistsInView[0]?.uri
    if (!uriToPlay) return
    store.dispatch.togglePlayState(uriToPlay)
  }

  toggleShuffle () {
    if (store.state.albumSortMethod === AlbumSortMethod.Random) {
      store.dispatch.changeAlbumSorting(AlbumSortMethod.ArtistName)
    } else {
      store.dispatch.changeAlbumSorting(AlbumSortMethod.Random)
    }
  }

  get currentRouteName () {
    return this.$route.name
  }

  get playerPaused () {
    return store.state.playerPaused
  }

  get shuffled () {
    return store.state.albumSortMethod === AlbumSortMethod.Random
  }
}
</script>

<style lang="scss" scoped>
.nav {
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  z-index: 10;

  > * {
    flex: 1;
    margin: 0 40px 0 0;
    cursor: pointer;
    text-align: center;
    white-space: nowrap;
  }

  > *:last-child {
    margin-right: 0;
  }
}
</style>
