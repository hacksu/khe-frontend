<template>
  <div class="sponsors">
    Thanks to these awesome companies for sponsoring us
    <SponsorList/>


    <a href="https://sponsor.khe.io">Interested in Sponsoring KHE?</a>

  </div>
</template>

<script>
import SponsorList from '@/components/SponsorList.vue';

export default {
  name: 'Sponsors',
  components: {
      SponsorList,
  },

};
</script>

<style lang="scss" scoped>
@import "@/scss/views/Sponsors.scss"; // Essential SCSS


</style>
