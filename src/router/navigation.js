/*
<router-link to="/">Home</router-link> |
<router-link to="/about">About</router-link> |
<router-link to="/logout" v-if="$store.state.auth.token">Logout</router-link>
<router-link to="/login" v-if="!$store.state.auth.token">Login</router-link>
*/

import store from '@/store'

let Logout = {
  get title() {
    return AUTHENTICATED ? 'Logout' : 'Login'
  },
  get path() {
    return AUTHENTICATED ? '/logout' : '/login'
  },
};

let Dropdown = {
  title: 'Dropdown',
  children: [
    Logout,
    {
      title: 'Home',
      path: '/',
    },
  ]
}

let Dashboard = {
  title: 'Dashboard',
  path: '/dashboard',
  get disabled() { // Hide when not logged in
    return !AUTHENTICATED;
  }
};

export default [
  {
    title: 'Home',
    path: '/',
  },
  {
    title: 'About',
    path: '/about',
  },
  {
    title: 'Apply',
    path: '/apply',
    get disabled() {
      return REGISTERED;
    }
  },
  Dashboard,
  Dropdown,
  Logout,

]

export let DashboardRoutes = [
  Dashboard,
  {
    title: 'Apply',
    path: '/dashboard/apply',
  },
  Dropdown,
  Logout,

]
