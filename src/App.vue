<template>
  <!--<div id="nav" v-if="!$route.path.includes('dashboard')">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/logout" v-if="$store.state.auth.token">Logout</router-link>
    <router-link to="/login" v-if="!$store.state.auth.token">Login</router-link>
  </div>-->
  <Navigation :routes="routes" v-if="!$route.path.toLowerCase().includes('dashboard')"/>
  <router-view/>
</template>

<script>
import Navigation from '@/components/navigation'
import Routes from '@/router/navigation'

export default {
  name: 'App',
  data() {
    return {
      routes: Routes,
    }
  },
  components: {
    Navigation,
  }
}

</script>

<style lang="scss">

</style>
