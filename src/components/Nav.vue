<template>
  <div id="nav">
    <div class="top-content">
      <div>
        <router-link v-if="currentRouteName !== 'browse'" to="/">
          &lt;
        </router-link>
      </div>

      <div id="site-title">
        <router-link to="/">
          <h1>E _ MOM</h1>
        </router-link>
      </div>

      <div>
        <router-link v-if="currentRouteName === 'browse'" to="/checkout">
          🛒
        </router-link>
      </div>
    </div>
    <p class="subtitle">
      DESIGNS FOR FEMINIST WITCHES<br>AND SOYBOY SNITCHES
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class Nav extends Vue {
  get currentRouteName () {
    return this.$route.name
  }
}
</script>

<style lang="scss" scoped>
#nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1;
  padding: 1em 1em 0.5em;
  box-sizing: border-box;
  text-align: center;
  background: white;

  .top-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5em;

    > * {
      flex: 1;

      &:nth-child(1) {
        text-align: left;
      }

      &:nth-child(3) {
        text-align: right;
      }
    }

    #site-title {
      white-space: nowrap;
    }
  }

  .subtitle {
    font-size: 0.9em;
  }
}
</style>
