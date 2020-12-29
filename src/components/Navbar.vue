<template>
  <div class="navbar">
    <router-link to="/" class="home-logo"><img src="@/assets/logo.png"></router-link>
    <button class="menu-btn" v-if="mobile" v-on:click="menuOpen = !menuOpen"><img src="@/assets/Hamburger.svg"></button>
    <slot v-if="!mobile"/>

    <teleport to="#app">
        <div id="navmenu" v-bind:class="{ active: menuOpen, }">
            <div class="navbar menu">
                <div>
                    <button v-on:click="closeOpen">closeOpen</button>
                    <slot/>
                </div>
            </div>
        </div>
    </teleport>
  </div>

</template>

<script>

export default {
  name: 'Navbar',
  data() {
      return {
          menuOpen: false,
      }
  },
  computed: {
      mobile() {
          return window.innerWidth <= 500;
      },
  },
  methods: {
      async closeOpen() {
          this.menuOpen = false;
          await new Promise((resolve) => {
              setTimeout(function() {
                  resolve();
              }, 5000);
          });
          this.menuOpen = true;
      }
  }
};
</script>

<style lang="scss">
@import "@/scss/components/Navbar.scss"; // Essential SCSS

.navbar {
  //padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    //padding: 10px;

    &.router-link-exact-active {
      color: #42b983;
    }
  }

}

$navbar-height: 38px;
.navbar {
    padding: 10px;
    height: $navbar-height;
    .home-logo {
        float: left;
        img {
            position: absolute;
            height: calc(#{$navbar-height} - 10px);
            margin-top: -5px;
        }
    }
    a, .menu-btn {
        display: inline-block;
        vertical-align: middle;
        padding: 10px;
        height: $navbar-height;
    }
    .menu-btn {
        float: right;
        cursor: pointer;
        @include rounded;
        background-color: rgba(0, 0, 0, 0.25);
        img {
            height: calc(#{$navbar-height} - 20px);
            margin-top: -10px;
            padding: 10px;
        }
    }
}

#navmenu {
    position: fixed;
    top: 0px;
    left: 0px;
    height: 100vh;
    width: 100vw;
    padding: 0px;
    background-color: rgba(0, 0, 0, 0.25);

    transition: opacity 0.15s;

    &:not(.active) {
        opacity: 0;
        pointer-events: none;
        .menu {
            top: 0vh;
            left: 25vw;
            width: 70vw;
            margin-top: 20px;
            max-height: 20vh;
            min-height: 20vh,
        }
    }

    .menu {
        position: absolute;
        top: 0px; //top: 3.5vh;
        margin-top: 15px; //$navbar-height;
        left: 4vw;
        padding: 0px;
        min-height: 50vh;
        overflow: hidden;
        width: 92vw;
        background-color: $color-bg-1;
        transition: top 0.15s, left 0.15s, max-height 0.15s, min-height 0.15s, margin-top 0.15s, width 0.15s;
        @include rounded;
        @include vertical-shadow;
        div {
            padding: 50px;
            height: 100%;
            a {
                display: block;
                font-size: 1.25em;
                height: calc(#{$navbar-height} / 2);
            }
        }
    }
}

</style>
