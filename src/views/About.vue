<template>
  <div class="about">
    <div class="description">
      <!-- <router-link to="/" class="cancel">
        x
      </router-link> -->
      <p>
        AWDEO 1738 is a stereo system designed for people who can't afford to listen to vinyl as much as they would like.
      </p>
      <br>
      <p>
        We love flipping through our record collection. We love listening to great records cover-to-cover. We just can't afford to buy a turntable, preamp, stereo, speakers, and 5 records a day.
      </p>
      <br>
      <p>
        AWDEO 1738 simulates the vinyl experience on your computer. You can flip through your albums & playlists. You can play them in full. That's it.
      </p>
      <br>
      <p>
        By default, records are organized by artist name with playlists at the end.
      </p>
      <br>
      <p>
        Hotkeys:
      </p>
      <ul>
        <li>Press a letter A - Z to jump through artist names.</li>
        <li>Use your &lt; and &gt; to flip through records. Hold shift as well to go to each extreme.</li>
        <li>Press shift-s to toggle shuffle.</li>
        <li>Press shift-a to view only albums. Press it again to view all media.</li>
        <li>Press shift-p to view only playlists. Press it again to view all media.</li>
      </ul>
    </div>
    <div class="contact">
      <p class="email">
        To send your love, a bug report, or anything in between, contact us at:
        <br>
        team@awdeo1738.com
      </p>
      <br>
      <div class="github">
        <a href="https://github.com/harrydshapiro/record-collection" target="_blank">github repo</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class About extends Vue {

}
</script>

<style lang="scss" scoped>
.about {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  text-align: left;
  margin: auto;

  h1 {
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
  }

  .description {
    margin: 0 0 100px 0;
    position: relative;
  }

  .contact {
    width: 100%;
  }

  .cancel {
    position: absolute;
    top: -44px;
    left: -104px;
    font-size: 22px;
  }
}
</style>
