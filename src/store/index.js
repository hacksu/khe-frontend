import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token') ?? false,
    status: '',
    user: {},
  },
  mutations: {
    fetchToken(state) {
      state.token = localStorage.getItem('token') ?? false;
    },
  },
  actions: {
    login({ commit }, { email, password }) {
      return new Promise(function(resolve, reject) {
        fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          })
        })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Request Failed: ${res.status} (${res.statusText})`)
          }
          return res.json()
        })
        .then(({ token }) => {
          localStorage.setItem('token', token);
          commit('fetchToken');
          resolve(true);
        }).catch(err => {
          // DEBUG
          localStorage.setItem('token', 'debug');
          commit('fetchToken');
          resolve(true);
          console.log(reject, err);
          //reject(err);
        })
      })
    },
    async logout({ commit, state }) {
      let req;
      try {
        req = await fetch('/api/logout', {
          headers: {
            'Authorization': `Bearer ${state.token}`,
          }
        })
      } catch(e) {
        // idk what to do
        console.error(e);
        console.log(req);
      } finally {
        localStorage.removeItem('token');
        commit('fetchToken')
      }
    },
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  },
  modules: {
  }
})
