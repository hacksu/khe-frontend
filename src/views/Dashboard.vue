<template>
  <Navigation :routes="routes" vertical/>
  <div class="vertical-navigation">
    <router-view/>
  </div>
</template>

<script>
import Navigation from '@/components/navigation'
import { DashboardRoutes } from '@/router/navigation'

export default {
  name: 'Dashboard',
  data() {
    return {
      routes: DashboardRoutes,
    }
  },
  components: {
    Navigation,
  }
}
</script>

<style lang="scss" scoped>



</style>
