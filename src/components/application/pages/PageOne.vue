<template>
  hi there
  <button v-on:click="Application.bruh = !Application.bruh">{{ Application.bruh ? 'turn bruh off' : 'turn bruh on' }}</button>
</template>

<script>
import Application from '../application';

export default {
  data() {
    return {
      Application,
    }
  }
}
</script>
