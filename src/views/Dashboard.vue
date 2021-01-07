<template>
  <div class="dashboard">
    <!--<Navbar id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
    </Navbar>
    Hacker Dashboard-->
    <div class="dashboard-nav" v-bind:class="{ 'show': menu, }">
      <div class="buttons" style="padding: 20px;">
        <router-link to="/">
          <img alt="Vue logo" src="../assets/logo.png" style="width: 80%; padding-top: 2vh">
        </router-link>
        <hr>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/dashboard/application">Apply</router-link>
        <router-link to="/dashboard/help">Help</router-link>
      </div>
    </div>
    <div class="dashboard-view">
      <div class="dashboard-header">
        <h1>{{ currentViewName }}</h1>
      </div>
      <router-view class="router-view"/>
    </div>
  </div>
</template>

<script>
//import Navbar from '@/components/Navbar.vue'

export default {
  name: 'Dashboard',
  data() {
    return {
      menu: false,
    }
  },
  computed: {
    currentViewName() {
      return this.$route.name;
    }
  },
  components: {
    //Navbar,

  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/views/dashboard"; // Essential SCSS

$nav-width: 300px;

.dashboard-nav {
  width: $nav-width;
  max-width: 80vw;
  background-color: rgba(0, 0, 0, 0.1);
  height: 100vh;
  position: fixed;
  left: -$nav-width;
  @include desktop {
    left: 0px;
  }
  @include display-not(desktop) {
    transition: left 0.25s;
    &.show {
      left: 0px;
    }
  }
  .buttons {
    a {
      display: block;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
}

.dashboard-view {
  @include desktop {
    width: calc(100vw - #{$nav-width});
    float: right;
  }
  .dashboard-header {
    @include desktop {
      margin-top: 1vh;
    }
    padding: 4vh;
    text-align: left;
  }
}

</style>
