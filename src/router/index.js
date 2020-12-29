import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Sponsors from '../views/Sponsors.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'

import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    alias: ['/signup', '/register'],
    component: Login,
    beforeEnter: (to, from, next) => {
      console.log('wat')
      // if we are logged in, redirect to query-specified OR dashboard
      if (store.getters.isLoggedIn) {
        if (to.query.redirect) {
          // convert to camel case. anything casing beyond first letter must be done in URL.
          // this code converts "apply" -> "Apply".
          // it isn't a perfect solution, but for MOST routes, named components are 1 word
          //   and this will allow lowercase url redirect paramater
          const CamelCased = String(to.query.redirect).replace(/^./, str => str.toUpperCase());
          next({ name: CamelCased, }) // redirect to named component
        } else {
          next({ name: 'Dashboard', }) // redirect to dashboard
        }
      } else {
        next() // not logged in, continue to authentication
      }
    },
  },
  {
    path: '/sponsors',
    name: 'Sponsors',
    alias: ['/sponsor', '/sponsorship'],
    component: Sponsors
  },
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: 'dashboard' */ '../views/Dashboard.vue'),
    beforeEnter: (to, from, next) => {
      // ensure we are logged in, otherwise redirect
      if (store.getters.isLoggedIn) {
        next();
      } else {
        next({ name: 'Login', query: {
          redirect: String(to.name),
        } })
      }
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: 'dashboard' */ '../views/dashboard/Landing.vue'),
      },
      {
        path: 'apply',
        alias: ['application'],
        name: 'Apply',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/Apply.vue'),
      }
    ],
  }
]

// Put the 404 not found route at the end.
// This should ALWAYS be the last route, as it is a wildcard.
routes.push({
  path: '/:catchAll(.*)',
  name: 'NotFound',
  component: NotFound,
})

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/apply') { // redirect /apply to /dashboard/apply
    next({ name: 'Apply', })
  } else {
    next();
  }
})

export default router