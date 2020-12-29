<template>
  <div class="application">
    Contact Us
  </div>
  Loaded: {{ loaded }}
  <br>
  {{ application }}
  <br>
  Failure in loading: {{ failure }}
</template>

<script>
import { MongooseValidate, MongooseValidateSync } from '@/schema';
import { Schema, State } from '@/schema/application';

// eslint-disable-next-line
const scope = function(obj, path) {
  for (const key of path.split('.')) {
    obj = obj[key];
  }
  return obj;
}

export default {
  name: 'Application',
  data() {
    return {
      loaded: false,
      failure: false,
      application: JSON.parse(JSON.stringify(State)),
    };
  },
  methods: {
    async fetchData() {
      try {
        const data = await (
            await fetch('/api/user/application.json')
        ).json();
        // Assigns instead of sets.
        //  New fields can be added via code that won't be overwritten by older saved data
        Object.assign(this.application, data);
        this.loaded = true;
        this.failure = false;
      } catch(e) {
        this.loaded = true;
        this.failure = e;
      }
    },

    // Same validation as executed on the server.
    // Server fetches some schema (such as application) from frontend code
    // Result: Backend and Frontend Schema always in sync, even in validation.

    // eslint-disable-next-line
    async validate(paths) {
      return await MongooseValidate(Schema, this.application, paths);
    },
    // eslint-disable-next-line
    validateSync(paths) {
      return MongooseValidateSync(Schema, this.application, paths);
    },

  },
  async mounted() {
    await this.fetchData();
    //console.log('All: ', await this.validate());
    //console.log('Bruh.Ok: ', await this.validate('bruh.ok'));
    //console.log('Phone and Name: ', await this.validate(['phone', 'name']));
    this.application.bruh.ok = 'yeeee';
    console.log('Bruh.Ok: ', await this.validate(['bruh.ok']));
  }
};
</script>

<style scoped lang="scss">
@import "@/scss/components/Application.scss"; // Essential SCSS


</style>
