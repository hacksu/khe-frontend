import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

import store from '@/store'

let Authenticated = {
  beforeEnter: (to, from, next) => {
    if (AUTHENTICATED) {
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
    if (!AUTHENTICATED) {
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
  '/authenticate': ({ to, next }) => { // Detects if people have already made an account and logged in.
    // If it wants you to authenticate, people will go to /signup instead if they have not logged in
    // on this device yet. Pretty snazzy if I do say so myself.
    if (REGISTERED) {
      next({
        path: '/login',
        query: to.query, // query persists due to redirect paramater.
      })
    } else {
      next({
        path: '/signup',
        query: to.query, // query persists due to redirect paramater.
      })
    }
  },
  '/logout': () => {
    store.dispatch('logout').then(() => {
      next('/login');
    }).catch(() => {
      //alert('LOGOUT FAILED');
      next('/');
    })
  },
  '/signup/confirm_email': ({ to }) => {
    next({
      path: '/api/user/confirm_email',
      query: {
        code: to.query.code,
        redirect: '/dashboard/apply',
      },
    })
  },
};

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  let redirect = redirects[to.path];
  if (redirect) {
    if (typeof redirect == 'function') {
      redirect({ to, from, next });
      return;
    } else {
      next(redirect)
      return;
    }
  } else {
    next();
  }
})

export default router
