<template>
  <div class="application">
    hey, application
    <span v-if="loaded">
      {{ application.state }}
      <br><br>
      {{ modified }}
      <br><br>
      <input v-model="state.name" v-validate="path('name')" placeholder="Name">
    </span>
    <span v-else>Not Loaded</span>
  </div>
</template>

<script>
import { setup, extend } from '@/store/application';

export default extend({
  name: 'Application',
  setup,
  components: {

  },
  async mounted() {
    let { application } = this;
    if (!application.loaded) {
      application.dispatch('load');
    }
    console.log(this.application);
    await this.application.dispatch('validate', ['name']);
    this.application.state.name = 'yea boi';
    await this.application.dispatch('validate', ['name']);

  },
})
</script>

<style lang="scss" scoped>
@import "@/scss/components/Application.scss"; // Essential SCSS

.invalid::after {
  display: inline-block;
  width: 10px;
  height: 10px;
  position: relative;
}

</style>
