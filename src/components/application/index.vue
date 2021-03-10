<template>
  <div>
    hmmm
    <component :is="'application-page-' + page"/>
    <br>

    <hr>{{ Application.toObject() }}<hr>

    <button v-on:click="prev">&lt;</button>
    {{ (page + 1) }} of {{ pageCount }}
    <button v-on:click="next">&gt;</button>
  </div>
</template>

<script>
import Application from './application';


import PageOne from './pages/PageOne.vue';
import PageTwo from './pages/PageTwo.vue';

let Pages = [
  PageOne,
  PageTwo,
];

import Finished from './pages/Finished.vue';
Pages.push(Finished);

let Indexes = 0;
for (let page of Pages) {
  page.index = Indexes++;
}

console.log(Pages);

export default {
  name: 'Application',
  data() {
    return {
      counter: 0,
      //pages: Pages.length,
      page: 0,
      Application,
    }
  },
  computed: {
    pages() {
      this.counter;
      return Pages.filter(o => o.enabled !== false);
    },
    pageCount() {
      return Pages.length;
    },

  },
  methods: {
    recompute() {
      this.counter++;
    },
    next() {
      this.go(1);
    },
    prev() {
      this.go(-1);
    },
    go(n) {
      this.recompute();
      let { page, pages, pageCount } = this;
      if (n > 0) {
        if (page + 1 == pageCount) {
          return;
        }
      } else {
        if (page == 0) {
          return;
        }
      }
      console.log(Math.max(0, Math.min(pageCount - 1, pages.findIndex(o => o.index == page) + n)));
      console.log(pages);
      let nextPage = pages[Math.max(0, Math.min(pageCount - 1, pages.findIndex(o => o.index == page) + n))];
      this.page = nextPage.index;
    }
  },
  components: {
    ...Object.fromEntries(Pages.map(o => [`application-page-${o.index}`, o]))
  }
}

</script>
