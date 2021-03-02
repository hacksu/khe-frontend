<template>
  <Navbar id="nav" :routes="routes" :vertical="vertical"></Navbar>
  <teleport to="body">
    <div id="nav-menu-background" v-bind:class="{ 'active': menu, }" v-on:click="menu = false"></div>
    <Navbar id="nav-menu" :routes="routes" class="menu" v-bind:class="{ 'active': menu, }"></Navbar>
  </teleport>
</template>

<script>
import Navbar from './Navbar';

export default {
  name: 'Navigation',
  props: {
    'routes': {
      type: Object,
      default: []
    },
    'vertical': {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      menu: false,
    }
  },
  components: {
    Navbar,
  },
  methods: {
    toggleMenu() {
      this.menu = !this.menu;
    }
  }
}

</script>

<style lang="scss">

#nav, #nav-menu {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

</style>
