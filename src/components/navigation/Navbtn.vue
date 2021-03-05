<template>
  <router-link class="navbtn" v-if="typeof link == 'string'" :to="link">{{ title }}</router-link>
  <a v-else class="navbtn-dropdown" tabindex="0" :class="{ active, }" v-on:click="toggleActive()" v-on:mouseenter="recompute">
    <a class="navbtn">
      {{ $display.mobile ? (active ? '&lsaquo; Back' : title) : title }}
    </a>
    <ul class="navbtn-dropdown-content" :style="dropdownStyle">
      <li v-for="route in link"><Navbtn :link="route.path" :title="route.title"/></li>
    </ul>
  </a>
</template>

<script>
import Navbtn from './Navbtn.vue'

export default {
  name: 'Navbtn',
  props: ['link', 'title'],
  data() {
    return {
      active: false,
      counter: 0,
    }
  },
  components: {
    Navbtn,
  },
  computed: {
    dropdownStyle() {
      this.counter;
      this.active;
      if (!this.$el) {
        return {};
      }
      return {
        'left': this.$el.offsetLeft + 'px',
        'min-width': Math.max(100, this.$el.offsetWidth) + 'px',
      }
    }
  },
  methods: {
    recompute() {
      this.counter++;
    },
    toggleActive() {
      if (this.$display.mobile) {
        this.active = !this.active;
        if (this.active) {
          this.$parent.$el.classList.add('dropdown-open')
        } else {
          this.$parent.$el.classList.remove('dropdown-open')
        }
        this.recompute();
      }
    }
  }
}

</script>

<style lang="scss" scoped>

.navbtn-dropdown {
  cursor: pointer;
  ul {
    list-style: none;
    margin: 0;
    padding-left: 0;
  }
  .navbtn-dropdown-content {
    position: absolute;
    visibility: hidden;
    left: 0;
    //min-width: 7rem;
    display: none;
  }
  &:hover, &:focus-within, &:focus, &.active {
    .navbtn-dropdown-content {
      visibility: visible;
      display: block;
      @include display-not(mobile) {
        border-radius: 0.5em;
      }
    }
  }
  @include mobile {
    &:not(.active) {
      &:hover, &:focus-within, &:focus {
        .navbtn-dropdown-content {
          visibility: hidden;
        }
      }
    }
  }
}


</style>
