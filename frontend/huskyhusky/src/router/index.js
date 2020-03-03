import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/archive',
    name: 'Archive',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Archive.vue')
  },
  {
    path: '/article/:name',
    name: 'Article',
    component: () => import('../views/Article.vue')
  },
  {
    path: '/about',
    name: 'About Us',
    component: () => import('../views/About.vue')
  },
  {
    path: '/write',
    name: 'Write'
  },
  {
    path: '/account',
    name: 'Account'
  },
  {
    path: '/signin',
    name: 'Sign In'
  },
  {
    path: '/signup',
    name: 'Sign Up'
  },
  {
    path: '/apply',
    name: 'Apply'
  }, 
  {
    path: '/applications',
    name: 'Applications'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
