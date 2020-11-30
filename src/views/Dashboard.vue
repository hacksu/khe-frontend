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

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '@/components/Navbar.vue'

export default defineComponent({
  name: 'Dashboard',
  components: {
    Navbar,

  }
});
</script>

<style lang="scss" scoped>
@import "@/scss/views/dashboard"; // Essential SCSS


</style>
