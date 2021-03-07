<template>
  second page!
</template>

<script>
import Application from '../application';

export default {
  get enabled() {
    if (Application.bruh) {
      return false;
    } else {
      return true;
    }
  }
}
</script>
