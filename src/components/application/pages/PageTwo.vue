<template>
  second page!
</template>

<script>
import Application from '../application';

export default {
  get enabled() {
    if ('bruh' in Application) {
      return false;
    } else {
      return true;
    }
  }
}
</script>
