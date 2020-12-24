<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" style="max-width: 80vw; max-height: 30vh;">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <SponsorList v-if="showSponsorList"/>
    <FAQ/>
    <Contact/>
    <Map/>
    <Application/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import SponsorList from '@/components/SponsorList.vue';
import Contact from '@/components/Contact.vue';
import Map from '@/components/Map.vue';
import FAQ from '@/components/FAQ.vue';
import Application from '@/components/Application.vue';

export default defineComponent({
  name: 'Home',
  data() {
    return {
      showSponsorList: true,
    }
  },
  components: {
    HelloWorld,
    SponsorList,
    Contact,
    Map,
    FAQ,
    Application,
  },
});
</script>

<style lang="scss" scoped>
@import "@/scss/views/Home.scss"; // Essential SCSS


</style>
