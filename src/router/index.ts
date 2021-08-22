import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Browse from '../views/Browse.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'browse',
    component: Browse
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import(/* webpackChunkName: "about" */ '../views/Checkout.vue')
  },
  {
    path: '/confirmation',
    name: 'confirmation',
    component: () => import(/* webpackChunkName: "about" */ '../views/Confirmation.vue')
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
