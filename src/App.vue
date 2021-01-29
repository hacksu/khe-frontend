<template>
  <!--<Navbar id="nav" v-if="!$route.path.includes('dashboard')">
    <router-link to="/">Home</router-link>
    <router-link to="/sponsors">Sponsors</router-link>
    <router-link to="/apply">Apply</router-link>
    <router-link to="/dashboard">Hacker Dashboard</router-link>
  </Navbar>-->
  <Navigation v-if="!$route.path.includes('dashboard')"/>
  <router-view/>
</template>

<script>
//import Navbar from './components/Navbar.vue'
import Navigation from '@/components/Navigation.vue'

export default {
  components: {
    //Navbar,
    Navigation,
  },
  mounted() {
    //let Schema = require('backend/db/user/application/schema');
    //console.log(Schema);
    //console.log('bruuh', window.require)
    //console.log(window.require('backend/db/user/application/schema'));
  }
};
</script>


<style lang="scss">
// @/global.scss and @/scss/index.scss are imported via vue.config.js

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
