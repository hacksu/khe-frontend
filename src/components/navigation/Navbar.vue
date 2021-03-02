<template>
  <div>
    <router-link v-for="route in routes.filter(o => !o.disabled)" :to="route.path">{{ route.title }}</router-link>
  </div>
</template>

<script>

export default {
  name: 'Navbar',
  props: {
    'routes': {
      type: Object,
    }
  }
}
</script>
