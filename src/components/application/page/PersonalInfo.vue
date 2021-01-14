<template>
  <div class="personal-info">
    <input v-model="app.name" placeholder="Full Name">
    {{ $data }}
    {{ application }}
    <button v-on:click="commit">commit</button>
  </div>
</template>

<script>

export default {
  props: {
    application: Object,
  },
  data() {
    let {
      name = '',
    } = this.application;
    let data = {
      app: {
        name,
      }
    }
    data._app = JSON.stringify(data);
    return data;
  },
  computed: {
    changed() {
      return JSON.stringify(this.app) != this._app;
    },
  },
  methods: {
    commit() { // push changes to the application
      console.log(this.app);
      this._app = JSON.stringify(this.app);
      this.$parent.$emit('commit', this.app)
    },
    discard() { // discard changes
      this.app = JSON.parse(this._app);
    },
  },
};
</script>

<style scoped lang="scss">
//@import "@/scss/components/FAQ.scss"; // Essential SCSS


</style>
