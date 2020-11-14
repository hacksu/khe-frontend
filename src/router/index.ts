import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
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

export default router
