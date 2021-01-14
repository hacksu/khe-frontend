<template>
  <div class="personal-info">
    <input v-model="app.name" placeholder="Full Name" v-on:input="validate('name')">
    {{ $data }}
    <br>
    {{ application }}
    <br>
    <button v-on:click="commit">commit</button>
    <br>
    {{ invalid.name ? invalid.name.message : '' }}
  </div>
</template>

<script>
import _ from 'lodash';
import { Validate } from '@/schema/application';

export default {
  props: {
    application: Object,
  },
  data() {
    let {
      name = '',
    } = this.application;
    let data = {
      app: {
        name,
      },
      invalid: {},
    }
    data._app = JSON.stringify(data);
    return data;
  },
  computed: {
    changed() {
      return JSON.stringify(this.app) != this._app;
    },
  },
  methods: {
    commit() { // push changes to the application
      console.log(this.app);
      this._app = JSON.stringify(this.app);
      this.$parent.$emit('commit', this.app)
    },
    discard() { // discard changes
      this.app = JSON.parse(this._app);
    },
    validate(property) {
      let this_ = this;
      return new Promise(function(resolve, reject) {
        let obj = _.merge(this_.application, this_.app);
        //property = (property instanceof String) ? [property] : property,
        Validate(obj, [property]).then(function(val) {
          //this_.invalid.res = val;
          /*for (let key of property) {

          }*/
          this_.invalid = {};
          resolve(val ?? true);
        }).catch(function(err) {
          for (let key in err.errors) {
            this_.invalid[key] = err.errors[key];
          }
          //this_.invalid.name = err;
          reject(err);
        })
        //this.invalid.name = res;
      })
    },
    oldvalidate(property) {
      //let obj = JSON.parse(JSON.stringify(this.app));
      //obj.__proto__ =
      let obj = _.merge(this.application, this.app);
      console.log(obj);
      if (property) {
        // validate specific field(s)
        if (!(property instanceof Array)) {
          // validate single field
          property = [property];
        }
        //return this.$parent.$parent.validateSync(property, obj)
      } else {
        // validate all fields in this page
        //return this.$parent.$parent.validateSync([property], obj)
      }
      try {
        //console.log(property);
        return this.$parent.$parent.validateSync(property, obj);
      } catch(e) {
        return e;
      }
    },
  },
};
</script>

<style scoped lang="scss">
//@import "@/scss/components/FAQ.scss"; // Essential SCSS


</style>
