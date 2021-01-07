<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" style="max-width: 80vw; max-height: 30vh;">
    <SponsorList v-if="showSponsorList"/>
    <FAQ/>
    <Contact/>
    <Map/>
    <Application/>
  </div>
</template>

<script>
import SponsorList from '@/components/SponsorList.vue';
import Contact from '@/components/Contact.vue';
import Map from '@/components/Map.vue';
import FAQ from '@/components/FAQ.vue';
import Application from '@/components/Application.vue';

export default {
  name: 'Home',
  data() {
    return {
      showSponsorList: true,
    }
  },
  components: {
    SponsorList,
    Contact,
    Map,
    FAQ,
    Application,
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/views/Home.scss"; // Essential SCSS


</style>
