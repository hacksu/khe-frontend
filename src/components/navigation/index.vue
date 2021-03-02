<template>
  <Navbar id="nav" :routes="routes" :vertical="vertical"></Navbar>
  <teleport to="body">
    <Navbar id="nav-menu" :routes="routes" class="menu"></Navbar>
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
  components: {
    Navbar,
  },
}

</script>

<style lang="scss">

#nav, #nav-menu {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

</style>
