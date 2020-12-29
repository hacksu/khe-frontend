<template>
  <div class="dashboard">
    <Navbar id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
    </Navbar>
    Hacker Dashboard
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'Dashboard',
  components: {
    Navbar,

  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/views/dashboard"; // Essential SCSS


</style>
