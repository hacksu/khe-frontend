<template>
  <div class="apply">
    Apply to KHE
    <Application/>
  </div>
</template>

<script>
import Application from '@/components/Application.vue';

export default {
  name: 'Apply',
  components: {
    Application,

  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/views/dashboard/Apply.scss"; // Essential SCSS



</style>
