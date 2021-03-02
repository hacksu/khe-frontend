<template>
  <div v-if="!vertical || $display.mobile" class="navbar" v-bind:style="style">
    <img src="../../assets/hamburger.svg" style="margin-left: 1em;" v-if="$display.mobile" class="hamburger" v-on:click="$parent.toggleMenu()">
    <div style="padding: 0px 2em;">
      <router-link  class="navbtn" v-bind:class="{ 'hidenav': $display.mobile, }" v-for="route in routes.filter(o => !o.disabled)" :to="route.path">{{ route.title }}</router-link>
    </div>
  </div>
  <div v-else class="navbar vertical">
    <router-link class="navbtn" v-if="!$display.mobile" v-for="route in routes.filter(o => !o.disabled)" :to="route.path">{{ route.title }}</router-link>
  </div>
</template>

<script>

export default {
  name: 'Navbar',
  props: ['routes', 'vertical'],
  data() {
    return {
      counter: 0,
      distance: 100,
      color: false,
    }
  },
  computed: {
    style() {
      this.counter;
      let { distance, $route, $display, $el } = this;
      let progress = 1;
      let color = false;
      let scrolling = (!$display.mobile && $route.meta && $route.meta.scrollNavigation) || false;
      let transitions = 'padding 0.15s, background-color 0.25s';
      if (!this.color) {
        transitions = false;
      }
      if ($el && $el.id == 'nav') {
        let offset = document.firstElementChild.scrollTop;
        if (scrolling) {
          progress = Math.min(1, offset / distance);
        }
        if (!this.color) {
          this.color = getComputedStyle($el).backgroundColor;
        }
        let rgb = this.color.split('(')[1].split(')')[0].split(', ').slice(0, 3);
        console.log(rgb);
        color = `rgba(${rgb.join(', ')}, ${progress})`
      }
      let padding = 30 * (1 - progress) + (10 * progress);
      //let color = getComputedStyle(this.$el)
      return {
        padding: `${padding}px 0px ${padding}px 0px`,
        'box-shadow': `0 5px 15px rgba(0, 0, 0, ${0.25 * progress})!important`,
        'position': 'fixed',
        'background-color': color,
        'transition': (this.color ? transitions : false)
      }
    }
  },
  methods: {
    recompute() {
      this.counter++;
    }
  },
  watch: {

  },
  mounted() {
    let { recompute } = this;
    document.addEventListener('scroll', recompute);
  }
}
</script>

<style lang="scss">

.navbtn {
  padding: 0.5em;
}

#nav {
  width: 100vw;
  top: 0px;
  //padding: 30px;
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
  &:not(.vertical) {
    .navbtn {
      height: $navbar-height;
      line-height: $navbar-height;
      display: inline-block;
      padding-top: 0px;
      padding-bottom: 0px;
    }
  }
}


#nav {
  .navbtn.hidenav {
    display: none;
  }
  .hamburger {
    display: inline-block;
    float: left;
    cursor: pointer;
  }
  height: $navbar-height;
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
