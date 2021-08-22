<template>
  <div id="app">
    <router-view />
    <Nav />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Nav from '@/components/Nav.vue'
import store from '@/store'

@Component({
  components: {
    Nav
  }
})
export default class App extends Vue {
  mounted () {
    store.dispatch.getMusic()
  }
}
</script>

<style>
@font-face {
  src: url('~@/assets/microgramma.ttf');
  font-family:'Microgramma'
}
@font-face {
  src: url('~@/assets/neue_montreal_regular.woff');
  font-family:'Neue Montreal';
  font-weight:400;
}

html {
  background: #C6AF7E;
}

body, p, h1 {
  margin: 0;
  color: white;
}

h1 {
  font-family: "Microgramma"
}

div, p {
  font-family: "Neue Montreal"
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

svg, svg:focus {
  outline:none !important;
}

a {
  color: inherit;
  text-decoration: none;
}
</style>
