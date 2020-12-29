<template>
  <button class="iconbutton">
    <i v-bind:style="{ 'background-image': 'url(' + img + ')'}" class="img"></i>
    <slot></slot>
  </button>
</template>

<script>

export default {
  name: 'IconButton',
  props: {
    img: {
      default: '',
      type: String,
    }
  },
};
</script>

<style scoped lang="scss">
@import "@/scss/components/input/IconButton.scss"; // Essential SCSS


</style>
