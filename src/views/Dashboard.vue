<template>
  <div class="dashboard">
    <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/dashboard">Dashboard</router-link>
    </div>
    Hacker Dashboard
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Dashboard',
  components: {

  }
});
</script>

<style lang="scss" scoped>



</style>