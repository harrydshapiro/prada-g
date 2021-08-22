import Vue from 'vue'
import Vuex from 'vuex'
import { createDirectStore } from 'direct-vuex'

export interface Product {
  price: number,
  name: string,
  id: number,
  image: string,
  'price-explanation': string
}

export interface RootState {
  cart: Product[]
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
  cart: [
  ],
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
    setCart (state, cart: Product[]) {
      state.cart = cart
    }
  },
  actions: {
    addToCart (context, product: Product) {
      const { state, commit } = rootActionContext(context)
      const cart = state.cart
      const newCart = Array.from(cart)
      newCart.push(product)
      commit.setCart(newCart)
    },

    removeFromCart (context, product: Product) {
      const { state, commit } = rootActionContext(context)
      const cart = state.cart
      const newCart = Array.from(cart).filter(p => p.id !== product.id)
      commit.setCart(newCart)
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
