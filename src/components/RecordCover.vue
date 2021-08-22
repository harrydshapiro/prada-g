<template>
  <div class="record-cover">
    <h1 class="album-name">
      {{ album && album.name }}
    </h1>
    <div class="album-artwork" @click="togglePlayback">
      <div class="play-pause-icon-container">
        <img v-if="currentlyPlayingThisAlbum" svg-inline class="play-icon" src="@/assets/pause.svg" alt="pause" />
        <img v-else svg-inline class="play-icon" src="@/assets/play.svg" alt="play" />
      </div>
      <img
        :src="recordCoverImgSrc"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import store from '@/store'
import hotkeys from 'hotkeys-js'

@Component({})
export default class RecordCover extends Vue {
  @Prop({ required: true }) album?: SpotifyApi.AlbumObjectFull

  mounted () {
    this.initializeHotKeys()
  }

  get recordCoverImgSrc () {
    return this.album?.images[0].url
  }

  get currentlyPlayingThisAlbum () {
    return !store.state.playerPaused && store.state.currentPlayerURI === this.album?.uri
  }

  togglePlayback () {
    const uri = this.album?.uri
    if (!uri) return
    store.dispatch.togglePlayState(uri)
  }

  initializeHotKeys () {
    hotkeys('space', (event, handler) => {
      event.preventDefault()
      const uri = this.album?.uri
      if (!uri) return
      store.dispatch.togglePlayState(uri)
    })
  }
}
</script>

<style lang="scss" scoped>
.record-cover {
  position: relative;

  .album-name {
    text-align: center;
    text-transform: uppercase;
    font-family: 'Microgramma', 'sans-serif';
    position: absolute;
    bottom: calc(100% + 20px);
    width: 100%;
  }

  .album-artwork {
    position: relative;
    cursor: pointer;

    .play-pause-icon-container {
      display: flex;
      position: absolute;
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: 0.28s;

      svg {
        fill: white;
        height: 30%;
        width: 30%;
      }
    }
  }

  .album-artwork:hover {
    .play-pause-icon-container {
      // display: flex;
      opacity: 1;
    }
  }

  img {
    width: 70vh;
    min-height: 70vh;
    object-fit: contain;
    margin: 0 20px;
  }
}
</style>
