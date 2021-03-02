<template>
  <Navigation/>
  <router-view/>
</template>

<script>
import Navigation from '@/components/navigation';
export default {
  name: 'Dashboard',
  components: {
    Navigation,
  }
}
</script>

<style lang="scss" scoped>



</style>
