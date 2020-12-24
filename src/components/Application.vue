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

<script lang="ts">
import { defineComponent } from 'vue';
import { Validate } from '@/schema';
import { Schema, State } from '@/schema/application';

// eslint-disable-next-line
const scope = function(obj: any, path: string) {
  for (const key of path.split('.')) {
    obj = obj[key];
  }
  return obj;
}

export default defineComponent({
  name: 'Application',
  data() {
    return {
      loaded: false,
      failure: false,
      application: State,
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
    validate(paths?: Array<string> | string): any {
      if (paths) {
        // Validate specific path(s)
        if (typeof paths == 'string') {
          // Only 1 path provides
          return Validate(scope(Schema, String(paths)), scope(this.application, String(paths)))
        } else {
          // Array of paths
          const validate = this.validate;
          return Object.fromEntries(Object.values(paths).map((o: string) => {
            return [o, validate(o)];
          }))
        }
      } else {
        // Validate whole application

      }
    },
  },
  async mounted() {
    await this.fetchData();
    console.log('All: ', this.validate());
    console.log('Bruh.Ok: ', this.validate('bruh.ok'));
    console.log('Phone and Name: ', this.validate(['phone', 'name']));
  }
});
</script>

<style scoped lang="scss">
@import "@/scss/components/Application.scss"; // Essential SCSS


</style>
