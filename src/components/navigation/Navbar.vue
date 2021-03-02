<template>
  <div v-if="!vertical || $display.mobile" class="navbar">
    <button v-if="$display.mobile" class="hamburger" v-on:click="$parent.toggleMenu()">hamburger</button>
    <router-link class="navbtn" v-bind:class="{ 'hidenav': $display.mobile, }" v-for="route in routes.filter(o => !o.disabled)" :to="route.path">{{ route.title }}</router-link>
  </div>
  <div v-else class="navbar vertical">
    <router-link class="navbtn" v-if="!$display.mobile" v-for="route in routes.filter(o => !o.disabled)" :to="route.path">{{ route.title }}</router-link>
  </div>
</template>

<script>

export default {
  name: 'Navbar',
  props: ['routes', 'vertical'],

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
@include display-not(mobile) {
  .vertical-navigation {
    padding-left: 280px;
    padding-right: 280px;
  }
}

#nav {
  .navbtn.hidenav {
    display: none;
  }
}
#nav-menu {
  opacity: 0;
  pointer-events: none;
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
  transition: opacity 0.15s;
  &.active {
    opacity: 1;
    pointer-events: all;
  }
  .navbtn {
    display: block;
  }
  .hamburger {
    display: none;
  }
  z-index: 10000;
  display: block;
  position: fixed;
  width: calc(100vw - 50px);
  top: 25px;
  left: 25px;
  padding: 10px 0px 10px 0px;
  border-radius: 0.5em;
}

#nav-menu-background {
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 2000;
  height: 100vh;
  width: 100vw;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  background-color: rgba(0, 0, 0, 0.5);
  &.active {
    pointer-events: all;
    opacity: 1;
  }
}


</style>
