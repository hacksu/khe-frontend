<template>
  <div class="application-pages">
    yea boiiiii
    {{ pages }}
    <component
      class="page"
      v-for="name in pages"
      v-bind:key="name"
      v-bind:is="name"
      v-bind:application="application"
    />
  </div>
</template>

<script>
import Pages from './page';

export default {
  name: 'ApplicationPages',
  props: {
    application: Object,
  },
  data() {
    return {
      pages: Object.keys(Pages),
    }
  },
  components: {
    ...Pages,
  },
};
</script>

<style scoped lang="scss">
@import "@/scss/components/application/Pages.scss"; // Essential SCSS


</style>
