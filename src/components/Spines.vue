<template>
  <div
    class="spines"
    :class="{
      left: textBaseline === 'left' ,
      right: textBaseline === 'right'
    }"
  >
    <div
      v-for="(record, index) in media"
      :key="index"
      class="spine"
      @click="selectSpine(record)"
    >
      <span>{{ record.name }}</span>
      <span>{{ spineArtistName(record) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { SanitizedMedia } from '@/types/sanitizedMedia'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Spines extends Vue {
  @Prop({ required: true }) media!: SanitizedMedia[]
  @Prop({ required: true }) textBaseline!: 'left' | 'right'

  selectSpine (media: SanitizedMedia) {
    this.$emit('selectSpine', media.id)
  }

  spineArtistName (mediaObj: SanitizedMedia) {
    if (mediaObj.type === 'playlist') return ''
    else return mediaObj.artists[0].name
  }
}
</script>

<style lang="scss" scoped>
.spines {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.spine {
  writing-mode: vertical-lr;
  text-align: center;
  font-family: 'Neue Montreal', 'sans-serif';
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  border-left: 1px solid white;
  margin-left: 5px;
  cursor: pointer;

  &.left {
    transform: rotate(180deg);

    &:first-child {
      margin-left: auto;
    }
  }
}

.spines.left {
  justify-content: flex-end;

  .spine {
    transform: rotate(180deg);
    flex-direction: row-reverse;

    &:first-child {
      margin-left: auto;
    }
  }
}
</style>
