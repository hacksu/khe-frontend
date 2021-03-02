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
  padding: 30px;
  &.vertical {
    .navbtn {
      display: block;
    }
    display: block;
    position: fixed;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.05);
    top: 0px;
    left: 0px;
  }
}

#nav.vertical {
  width: 200px;
}
.vertical-navigation {
  padding-left: 280px;
  padding-right: 280px;
}

#nav-menu {
  .navbtn {
    display: block;
  }
}




</style>
