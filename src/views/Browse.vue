<template>
  <div id="browse">
    <ProductTile
      v-for="(product, index) in productList"
      :key="index"
      :product="product"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import productList from '@/products'
import ProductTile from '@/components/ProductTile.vue'

@Component({
  components: {
    ProductTile
  }
})
export default class Browse extends Vue {
  productList = productList
}
</script>

<style lang="scss" scoped>
#browse {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 1em;
}

.product-tile {
  margin: 0 0 1em;

  @media (min-width: 520px) {
    margin-left: 1em;
    margin-right: 1em;
  }
}
</style>
