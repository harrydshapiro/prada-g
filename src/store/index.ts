import Vue from 'vue'
import Vuex from 'vuex'
import { createDirectStore } from 'direct-vuex'
import products from '@/products.json'

export interface Product {
  price: number,
  name: string,
  id: string,
  image: string,
  'price-explanation': string
}

export interface CartItem {
  product: Product,
  count: number
}

export interface Cart {
  [productId: Product['id']]: CartItem
}

export interface RootState {
  cart: Cart
  customerDetails: {
    name: string,
    email: string,
    address: {
      streetOne: string,
      streetTwo: string,
      city: string,
      state: string,
      zip: string
    }
  }
}

Vue.use(Vuex)

const state: RootState = {
  cart: {},
  customerDetails: {
    name: '',
    email: '',
    address: {
      streetOne: '',
      streetTwo: '',
      city: '',
      state: '',
      zip: ''
    }
  }
} as RootState

const {
  store,
  rootActionContext,
  moduleActionContext,
  rootGetterContext,
  moduleGetterContext
} = createDirectStore({
  state,
  modules: {
  },
  mutations: {
    setCart (state, cart: Cart) {
      state.cart = cart
    }
  },
  actions: {
    addToCart (context, productId: Product['id']) {
      const { state, commit } = rootActionContext(context)
      const newCart: Cart = JSON.parse(JSON.stringify(state.cart))
      if (newCart[productId]) {
        newCart[productId].count++
      } else {
        newCart[productId] = {
          // @ts-ignore
          product: products[productId],
          count: 1
        }
      }
      commit.setCart(newCart)
    },
    removeFromCart (context, productId: Product['id']) {
      const { state, commit } = rootActionContext(context)
      const newCart: Cart = JSON.parse(JSON.stringify(state.cart))
      if (newCart[productId]?.count > 1) {
        newCart[productId].count--
      } else {
        delete newCart[productId]
      }
      commit.setCart(newCart)
    },
    clearCart (context) {
      const { commit } = rootActionContext(context)
      commit.setCart({})
    }
  },
  getters: {
  }
})

// Export the direct-store instead of the classic Vuex store.
export default store

// The following exports will be used to enable types in the
// implementation of actions.
export { rootActionContext, moduleActionContext, rootGetterContext, moduleGetterContext }

// The following lines enable types in the injected store '$store'.
export type AppStore = typeof store
declare module 'vuex' {
  interface Store<S> {
    direct: AppStore
  }
}
