<template>
  <div class="personal-info">
    ok personal info
    <input v-model="application.name">
  </div>
</template>

<script>
import { inherit } from './logic.js';

export default inherit({
  methods: {
    validate() {
      return true;
    }
  },
  mounted() {
    console.log('ok did mount');
    //console.log(this);
    //console.log(this.application);
    //this.super();
  }
});
</script>

<style scoped lang="scss">
//@import "@/scss/components/FAQ.scss"; // Essential SCSS


</style>
