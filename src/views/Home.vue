<template>
  <div class="home">
    <Landing/>
    <SponsorList v-if="showSponsorList"/>
    <FAQ/>
    <Contact/>
    <Map/>
    <Application/>
  </div>
</template>

<script>
import Landing from '@/components/Landing.vue';
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
    Landing,
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
