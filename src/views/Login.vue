<template>
  <div class="login">
    please login or signup

    <button v-on:click="simulateLogin">Similate Login</button>
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';
import router from '@/router';

export default defineComponent({
  name: 'Login',
  components: {

  },
  methods: {
      simulateLogin() {
          store.state.token = true;
          this.loginSuccess();
          
      },
      loginSuccess() { // Redirect based on success
          const route = router.currentRoute.value;
          if (route.query.redirect) {
              const CamelCased = String(route.query.redirect).replace(/^./, str => str.toUpperCase());
              router.push({ name: CamelCased, })
          } else {
              router.push({ name: 'Dashboard', })
          }
      }
  },
});
</script>

<style lang="scss" scoped>
@import "@/scss/views/Login.scss"; // Essential SCSS


</style>