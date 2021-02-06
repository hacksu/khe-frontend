import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import backend from './backend'

store.dispatch('init');

export let app = createApp(App);
app.use(store).use(router).use(backend).mount('#app')
