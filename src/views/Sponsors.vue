<template>
  <div class="sponsors">
    Thanks to these awesome companies for sponsoring us
    <SponsorList/>

    
    <a href="https://sponsor.khe.io">Interested in Sponsoring KHE?</a>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SponsorList from '@/components/SponsorList.vue';

export default defineComponent({
  name: 'Sponsors',
  components: {
      SponsorList,
  },

});
</script>

<style lang="scss" scoped>
@import "@/scss/views/Sponsors.scss"; // Essential SCSS


</style>