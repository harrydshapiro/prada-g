<template>
  <div id="checkout">
    <div v-if="cart.length === 0">
      No items in cart
    </div>
    <div v-else>
      <!-- products in cart -->
      <div v-for="(product, index) in cart" :key="index" class="product">
        <p class="product-name">
          {{ product.name }}
        </p>
        <div class="product-details">
          <img class="product-image" :src="product.image" />
          <div class="price-explanation">
            {{ product['price-explanation'] }}
          </div>
        </div>
      </div>

      <!-- customer details -->
      <form id="customer-details" @submit="submit">
        <label for="customer-name">What's your name?</label>
        <input id="customer-name" name="customer-name" type="text">
        <label for="customer-email">What's your email?</label>
        <input id="customer-email" name="customer-email" type="text">
        <p>shipping:</p>
        <p>ideally meet up with me in nyc :)</p>
        <p>if not, fill this out</p>
        <label for="street-one">Street 1</label>
        <input id="street-one" name="street-one" type="text">
        <label for="street-two">Street 2</label>
        <input id="street-two" name="street-two" type="text">
        <label for="city">City</label>
        <input id="city" name="city" type="text">
        <label for="state">State</label>
        <input id="state" name="state" type="text">
        <label for="zip">Zip</label>
        <input id="zip" name="zip" type="number">
        <input type="submit">
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import store from '@/store'

@Component({})
export default class Checkout extends Vue {
  get cart () {
    return store.state.cart
  }

  invalidCustomerDetails (customerDetails: Record<string, string>): string[] {
    const invalidKeys = []

    for (const key in customerDetails) {
      const value = customerDetails[key]

      const unrequiredFields = ['street-two']
      if (
        (!unrequiredFields.includes(key) && !value) ||
        (key === 'zip' && value.length !== 5) ||
        (key === 'customer-email' && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)))
      ) {
        invalidKeys.push(key)
      }
    }

    return invalidKeys
  }

  submit (submissionEvent: any) {
    submissionEvent.preventDefault()
    const formData = new FormData(submissionEvent.target)
    const customerDetails = [...formData.entries()]
      .reduce((all: Record<string, any>, entry) => {
        all[entry[0]] = entry[1]
        return all
      }, {})

    const invalidDetails = this.invalidCustomerDetails(customerDetails)

    if (invalidDetails.length > 0) {
      // send the form submission
      // show confirmation screen
      console.log('invalid keys', invalidDetails)
    } else {
      // show invalid message
      console.log('everything is valid')
    }
  }
}
</script>

<style lang="scss" scoped>
#checkout {
  padding: 0 2em;

  .product {
    .product-name {
      font-weight: 600;
      margin-bottom: 1em;
    }
    .price-explanation {
      white-space: pre-line;
    }
    .product-details {
      display: flex;
      .product-image {
        height: 100px;
        width: 100px;
        flex-shrink: 0;
        object-fit: cover;
        margin-right: 1em;
      }
    }
  }
}

form#customer-details {
  display: flex;
  flex-direction: column;
}
</style>
