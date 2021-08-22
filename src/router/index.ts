import Vue from 'vue'
import VueRouter, { RouteConfig, Route, NavigationGuardNext } from 'vue-router'
import Music from '@/views/Music.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Music',
    component: Music
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/code-redirect',
    name: 'codeRedirect',
    async beforeEnter (to, from, next) {
      next({
        name: 'Music',
        replace: true
      })
    }
  }
  // TODO: WILDCARD ROUTE?
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
