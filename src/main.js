import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import DatabaseClient from '@/db';
let { ApplicationSchema } = DatabaseClient;
console.log({ ApplicationSchema })


createApp(App).use(store).use(router).mount('#app');

console.log(store);
if (store.state.auth.token) {
  (async () => {
    try {
      console.log(await store.dispatch('login', 'session'));
    } catch (e) {
      console.error(e);
    }
  })();
}
global.store = store;
