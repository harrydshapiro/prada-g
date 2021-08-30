<template>
  <div class="product-tile">
    <p class="product-name">
      {{ product.name }}
    </p>
    <img :src="product.image" class="product-image" />
    <div class="cta" @click="toggleCartInclusion">
      {{ isInCart ? 'remove from 🛒' : 'add to 🛒' }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import store, { Product } from '@/store'

@Component({})
export default class ProductTile extends Vue {
  @Prop({ required: true }) product!: Product

  get isInCart () {
    // @ts-ignore
    return !!store.state.cart[this.product.id]
  }

  toggleCartInclusion () {
    if (this.isInCart) {
      store.dispatch.removeFromCart(this.product.id)
    } else {
      store.dispatch.addToCart(this.product.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.product-tile {
  text-align: right;

  .product-name {
    font-weight: 600;
    margin-bottom: 1em;
  }

  .product-image {
    width: 75vw;
    height: 80vw;
    object-fit: cover;

    @media (min-width: 520px) {
      width: 350px;
      height: 350px;
    }
  }

  .cta {
    cursor: pointer;
  }
}
</style>
