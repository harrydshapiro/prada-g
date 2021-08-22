<template>
  <div id="app">
    <Nav />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Nav from '@/components/Nav.vue'

@Component({
  components: {
    Nav
  }
})
export default class App extends Vue {
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
@font-face {
  src: url('~@/assets/NeueMontreal-Bold.woff');
  font-family:'Neue Montreal';
  font-weight:600;
}

body, p, h1 {
  margin: 0;
  color: black;
}

h1 {
  font-family: "Microgramma";
  font-size: 1.5em;
}

div, p, label, input {
  font-family: "Neue Montreal"
}

#app {
  display: flex;
  justify-content: center;
  padding-top: 5em;
}

svg, svg:focus {
  outline:none !important;
}

a {
  color: inherit;
  text-decoration: none;
}
</style>
