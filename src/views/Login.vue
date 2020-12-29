<template>
  <div class="login">

    <div v-if="action == 'login'">
      <h1>Login</h1>

      <button v-on:click="login">Login</button>
    </div>
    <div v-else>
      <h1>Create Account</h1>

      <button v-on:click="signup">Create Account</button>
      <IconButton v-bind:img="require('@/assets/logo.png')"><span>SIGN IN WITH GITHUB</span></IconButton>
    </div>
    <button v-on:click="switchAction">{{ action == 'login' ? 'Create Account' : 'I already have an Account' }}</button>


    <button v-on:click="simulateLogin">Similate Login</button>

  </div>
</template>

<script>
import store from '@/store';
import router from '@/router';
import IconButton from '@/components/input/IconButton.vue';

export default {
  name: 'Login',
  data() {
    return {
      action: this.$route.path.substr(1), //this.$route.path.includes('login') ? 'login' : 'signup',
      email: '',
      password: '',
      name: {
        first: '',
        last: '',
      },
    }
  },
  components: {
    IconButton,

  },
  methods: {
      simulateLogin() {
          store.state.token = true;
          this.loginSuccess();

      },
      login(evt) {
        console.log('login')
      },
      signup(evt) {
        console.log('signup')
      },
      switchAction() {
        if (this.action == 'login') {
          history.replaceState(history.state, '', window.location.href.split(this.action).join('register'));
          this.action = 'register';
        } else {
          history.replaceState(history.state, '', window.location.href.split(this.action).join('login'));
          this.action = 'login';
        }
        this.$route.path = `/${this.action}`;
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
};
</script>

<style lang="scss" scoped>
@import "@/scss/views/Login.scss"; // Essential SCSS

.iconbutton {
  font-size: 1em;
  padding: 10px;
  border-radius: 0.5em;
  span {
    font-size: 0.8em;
  }
}

</style>
