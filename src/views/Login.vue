<template>
  <div v-if="$route.path == '/login'">
    <h1>Login</h1>

    <form @submit.prevent="login" v-on:input="error = ''">
      <input type="email" v-model="email" placeholder="Email"><br>
      <input type="password" v-model="password" placeholder="Password"><br>
      <button v-on:click="login">Login</button>
    </form>
    <div v-bind:style="{ 'opacity': error.length > 0 ? 1 : 0, }">{{ error || '_' }}</div>

    <br>

    <router-link to="/signup" v-on:click="swap">Don't have an account?</router-link>
  </div>
  <div v-else>
    <h1>Signup</h1>

    <form @submit.prevent="register" v-on:input="error = ''">
      <input type="name" v-model="name" placeholder="Full Name"><br>
      <input type="email" v-model="email" placeholder="Email"><br>
      <input type="password" v-model="password" placeholder="Password"><br>
      <button v-on:click="login">Login</button>
    </form>
    <div v-bind:style="{ 'opacity': error.length > 0 ? 1 : 0, }">{{ error || '_' }}</div>

    <br>

    <router-link to="/login" v-on:click="swap">Already have an account?</router-link>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      name: '',
      password: '',
      error: '',
    }
  },
  methods: {
    swap($event) {
      $event.preventDefault();
      this.$router.push({ path: $event.target.href, force: true })
    },
    login($event) {
      $event.preventDefault();
      let { email, password, $route, $router } = this;
      let data = this;
      this.$store.dispatch('login', { email, password }).then(() => {
        if ('redirect' in $route.query) {
          $router.push($route.query)
        } else {
          $router.push('Dashboard');
        }
      }).catch(err => {
        data.error = err.message;
      })
    },
    register() {
      $event.preventDefault();
      let { email, name, password, $route, $router } = this;
      let data = this;
      this.$store.dispatch('register', { email, name, password }).then(() => {
        $router.push('Apply');
      }).catch(err => {
        data.error = err.message;
      })
    },
  },
}
</script>
