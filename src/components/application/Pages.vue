<template>
  <div class="application-pages">
    {{ application }}
    <br>
    {{ cachedApplication }}
    <br>
    changed: {{ changed }}
    <br>
    status: {{ application.editing ? 'editing' : 'new applicant' }}
    <component
      class="page"
      v-for="(name, index) in pages"
      v-bind:key="name"
      v-bind:name="name"
      v-bind:is="name"
      v-bind:application="application"
      v-bind:class="{ 'hidePage': index != pageIndex, }"
    />
    <button v-if="canPrevPage" v-on:click="prevPage">Back</button>
    <button v-if="canNextPage" v-on:click="nextPage">Next</button>

  </div>
</template>

<script>
import Pages from './page';

let escapeId = function(obj) {
  let appl = {
    ...obj,
  };
  if ('_id' in appl) {
    delete appl['_id'];
  }
  return appl;
}

export default {
  name: 'ApplicationPages',
  props: {
    application: Object,
  },
  data() {
    return {
      pageIndex: 0,
      pages: Object.keys(Pages),
      pages_: {},
      cachedApplication: JSON.stringify(escapeId(this.application)),
    }
  },
  computed: {
    canNextPage() {
      if (this.pageIndex + 1 < this.pages.length) {
        let currentPage = this.pages_[this.pages[this.pageIndex]];
        if (currentPage) {
          if ('validate' in currentPage) {
            return currentPage.validate();
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
      return false;
    },
    canPrevPage() {
      if (this.pageIndex > 0) {
        return true;
      }
      return false;
    },
    changed() {
      if (this.cachedApplication) {
        return JSON.stringify(escapeId(this.application)) != this.cachedApplication;
      }
      return false;
    }
  },
  methods: {
    nextPage() {
      if (this.canNextPage) {
        this.pageIndex++;
      }
    },
    prevPage() {
      if (this.canPrevPage) {
        this.pageIndex--;
      }
    },
    updateCache() {
      console.log('APPLICATION CACHE UPDATED')
      this.cachedApplication = JSON.stringify(escapeId(this.application));
    }
  },
  components: {
    ...Pages,
  },
  mounted() {
    if (this.$parent.loaded) {
      this.updateCache();
    } else {
      let this_ = this;
      this.$parent.loadCallback = function() {
        this_.updateCache();
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/scss/components/application/Pages.scss"; // Essential SCSS

.hidePage {
  display: none;
}

</style>
