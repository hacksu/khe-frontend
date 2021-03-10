import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import responsive from '@/components/responsive';

let app = createApp(App);
app.use(store).use(router).use(responsive).mount('#app');

import bruh from '@/components/application/validate.js';

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
