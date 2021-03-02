<template>
  <div v-if="!vertical">
    <router-link class="navbtn" v-for="route in routes.filter(o => !o.disabled)" :to="route.path">{{ route.title }}</router-link>
  </div>
  <div v-else class="vertical">
    <router-link class="navbtn" v-for="route in routes.filter(o => !o.disabled)" :to="route.path">{{ route.title }}</router-link>
  </div>
</template>

<script>

export default {
  name: 'Navbar',
  props: ['routes', 'vertical']
}
</script>

<style lang="scss">

.navbtn {
  padding: 0.5em;
}

#nav {
  &.vertical {
    .navbtn {
      display: block;
    }
    display: block;
    position: absolute;
  }
}

#nav-menu {
  .navbtn {
    display: block;
  }
}




</style>
