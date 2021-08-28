<template>
  <div id="checkout">
    <div v-if="cart.length === 0">
      No items in cart
    </div>
    <div v-else>
      <p class="section-header">
        🛒 Cart
      </p>
      <br>
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
        <p class="section-header">
          contact
        </p>
        <label :class="{ error: invalidCustomerDetails.includes('customer-name') }" for="customer-name">What's your name?</label>
        <input id="customer-name" name="customer-name" type="text">
        <label :class="{ error: invalidCustomerDetails.includes('customer-email') }" for="customer-email">What's your email?</label>
        <input id="customer-email" name="customer-email" type="text">
        <br>

        <p class="section-header">
          shipping:
        </p>
        <p>ideally hmu to meet up in nyc :)<br>if not, please fill this out</p>
        <br>
        <label :class="{ error: invalidCustomerDetails.includes('street-one') }" for="street-one">Street 1</label>
        <input id="street-one" name="street-one" type="text">
        <label for="street-two">Street 2</label>
        <input id="street-two" name="street-two" type="text">
        <label :class="{ error: invalidCustomerDetails.includes('city') }" for="city">City</label>
        <input id="city" name="city" type="text">
        <label :class="{ error: invalidCustomerDetails.includes('state') }" for="state">State</label>
        <input id="state" name="state" type="text">
        <label :class="{ error: invalidCustomerDetails.includes('zip') }" for="zip">Zip</label>
        <input id="zip" name="zip" type="number">
        <input type="submit">
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import store from '@/store'
import axios from 'axios'

@Component({})
export default class Checkout extends Vue {
  invalidCustomerDetails: string[] = []

  get cart () {
    return store.state.cart
  }

  setInvalidCustomerDetails (customerDetails: Record<string, string>) {
    const invalidKeys = []

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(customerDetails['customer-email']))) {
      invalidKeys.push('customer-email')
    }

    if (!customerDetails['customer-name']) invalidKeys.push('customer-name')

    const shippingFormAtLeastPartial =
      customerDetails['street-one'] || customerDetails['street-two'] || customerDetails.city || customerDetails.state || customerDetails.zip

    if (shippingFormAtLeastPartial) {
      if (customerDetails.zip.length !== 5) {
        invalidKeys.push('zip')
      }
      if (!customerDetails['street-one']) invalidKeys.push('street-one')
      if (!customerDetails.city) invalidKeys.push('city')
      if (!customerDetails.state) invalidKeys.push('state')
      if (!customerDetails.zip) invalidKeys.push('zip')
    }

    this.invalidCustomerDetails = invalidKeys
  }

  async submit (submissionEvent: any) {
    submissionEvent.preventDefault()
    const formData = new FormData(submissionEvent.target)
    const customerDetails = [...formData.entries()]
      .reduce((all: Record<string, any>, entry) => {
        all[entry[0]] = entry[1]
        return all
      }, {})

    this.setInvalidCustomerDetails(customerDetails)

    if (this.invalidCustomerDetails.length === 0) {
      // await sending the email!
      try {
        await axios.post(process.env.VUE_APP_API_URL + 'checkout', {
          customerDetails,
          cart: this.cart
        })
        // show confirmation screen
      } catch (err) {
        console.error(err)
        // if theres an error ask them to just hmu about it
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#checkout {
  padding: 0 2em 5em;

  .product {
    margin-bottom: 2em;

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

  .section-header {
    font-weight: 600;
  }

  form#customer-details {
    display: flex;
    flex-direction: column;

    label.error {
      color: red;
    }

    input {
      margin-bottom: 0.5em;
    }

    input[type=submit] {
      background: black;
      border: none;
      padding: 5px 25px;
      width: fit-content;
      color: white;
      border-radius: 2px;
      margin: 2em 0 0 auto;
    }
  }
}
</style>
