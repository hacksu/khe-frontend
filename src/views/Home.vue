<template>
  <div class="home">
    <Landing/>
    {{ ApplicationSchema }}
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
import { ApplicationSchema, Validators } from '@/backend';
//import { db } from '@/backend';
//let { application: { Schema: ApplicationSchema }} = db;
//console.log(ApplicationSchema);
//let Schema = require('backend/db/user/application/schema');

export default {
  name: 'Home',
  data() {
    return {
      showSponsorList: true,
      ApplicationSchema,
      application: {
        //name: '',
        //phone: '',
      },
    }
  },
  methods: {
    ...Validators(ApplicationSchema, o => o.application),
  },
  components: {
    Landing,
    SponsorList,
    Contact,
    Map,
    FAQ,
    Application,
  },
  mounted() {
    console.log(ApplicationSchema);
    try {
      console.log('valid1', this.validateSync(['name']));
    } catch(e) {
      console.log(e);
    }
    this.application.name = 'yea';
    console.log('valid2', this.validateSync(['name']));
    let this_ = this;
    window.yee = function(v) {
      this_.application.phone = v;
      try {
        console.log('phone valid =', this_.validateSync(['phone']));
      } catch(e) {
        console.log(e);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/views/Home.scss"; // Essential SCSS


</style>
