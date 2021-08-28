<template>
  <div id="confirmation">
    <p>Success!</p>
    <p>Check your email for a confirmation email. If you have any issues or questions, reach out to team@e-mom.energy</p>
    <br><br>
    <router-link to="/">
      <p class="back-home">
        Back to home page
      </p>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class About extends Vue {

}
</script>

<style lang="scss" scoped>
#confirmation {
  text-align: center;
  padding: 0 2em;

  .back-home {
    cursor: pointer;
    font-weight: 600;
  }
}
</style>
