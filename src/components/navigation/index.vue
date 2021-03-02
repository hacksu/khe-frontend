<template>
  <Navbar :routes="routes"></Navbar>
</template>

<script>
import Navbar from './Navbar';

export default {
  name: 'Navigation',
  props: {
    'routes': {
      type: Object,
      default: [
        {
          title: 'Home',
          path: '/',
        },
        {
          get title() {
            return (Math.random() * 100).toFixed(3);
          },
          path: '/dashboard',
        }
      ],
    }
  },
  components: {
    Navbar,
  },
}

</script>
