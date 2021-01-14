<template>
  <div class="landing" v-bind:style="(height) ? { 'height': height + 'px', } : {}">
    <div class="content">
      <div class="background"/>
      <img alt="Vue logo" src="@/assets/logo.png" style="max-width: 80vw; max-height: 30vh;">

    </div>
  </div>
</template>

<script>

export default {
  name: 'Landing',
  data() {
    return {
      //...details,
      height: false,
    };
  },
  mounted() {
    /*
      This is to fix a weird issue with the address bar on mobile browsers
      changing in height as you scroll, which leads to big fuckups
      with the responsiveness of this component, as it is set to
      100vh, or 100% of vertical height of the display....
        ....which changes when you scroll..... great, right?

      so to fix this, we manually detect the height of the browser with code,
      which bypasses the cheap magic the address bar uses (technically, it
      just pushes the page downard off-screen, meaning 100vh is placed
      beyond the bottom of your screen, which is unintended side effect).
      So, we set the height of the element to the ACTUAL height if there
      is a mismatch between its CSS 100vh height and the actual browser height
      (aka, window.innerHeight).
    */
    let landingHeight = document.querySelector('.landing').clientHeight;
    let totalHeight = window.innerHeight;
    if (landingHeight != totalHeight) {
      this.height = totalHeight;
    }
    //this.height = [landingHeight, totalHeight]
  }
};
</script>

<style scoped lang="scss">
@import "@/scss/components/Landing.scss"; // Essential SCSS

.landing {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .content {
    margin-top: 20vh;
  }
  .background {
    position: absolute;
    z-index: -2;
    top: 0px;
    left: 0px;
    height: 100vh;
    width: 100vw;
    background-color: #142027;
  }
}

</style>
