import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

import store from '@/store'

let Authenticated = {
  beforeEnter: (to, from, next) => {
    if (store.state.auth.token) {
      next();
    } else {
      next({
        path: '/authenticate',
        query: {
          redirect: to.name,
        }
      })
    }
  },
};
let NotAuthenticated = {
  beforeEnter: (to, from, next) => {
    if (!store.state.auth.token) {
      next();
    } else {
      if ('redirect' in to.query) {
        next(to.query.redirect);
      } else {
        next('/dashboard');
      }
    }
  },
}

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
    path: '/login',
    name: 'Login',
    alias: ['/register', '/signup'],
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    ...NotAuthenticated,
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
    ],
    ...Authenticated,
  }
];

let redirects = {
  '/apply': '/dashboard/apply',
};

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  let redirect = redirects[to.path];
  if (redirect) {
    if (typeof redirect == 'function') {
      redirect(to, from, next);
      return;
    } else {
      next(redirect)
      return;
    }
  }
  if (to.path == '/signup/confirm_email') {
    next({
      path: '/api/user/confirm_email',
      query: {
        code: to.query.code,
        redirect: '/dashboard/apply',
      },
    })
  } else if (to.path == '/authenticate') {
    if (localStorage.getItem('KHE_FRONTEND_ACCOUNT_REGISTERED')) {
      next({
        path: '/login',
        query: to.query,
      })
    } else {
      next({
        path: '/signup',
        query: to.query,
      })
    }
  } else if (to.path == '/logout') {
    store.dispatch('logout').then(() => {
      next('/login');
    }).catch(() => {
      alert('LOGOUT FAILED');
      next(-1);
    })
  } else {
    next();
  }
})

export default router
