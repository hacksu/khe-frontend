import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
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
  },
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/Landing.vue'),
      },
      {
        path: 'apply',
        name: 'Apply',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/Apply.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/signup/confirm_email') {
    next({
      path: '/api/user/confirm_email',
      query: {
        code: to.query.code,
        redirect: '/dashboard/apply',
      },
    })
  } else {
    next();
  }
})

export default router
