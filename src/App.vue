<template>
  <Navbar id="nav" v-if="!$route.path.includes('dashboard')">
    <router-link to="/">Home</router-link>
    <router-link to="/sponsors">Sponsors</router-link>
    <router-link to="/apply">Apply</router-link>
    <router-link to="/dashboard">Hacker Dashboard</router-link>
  </Navbar>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from './components/Navbar.vue'

export default defineComponent({
  components: {
    Navbar,
  }
});
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
