import { createStore } from 'vuex'

export default createStore({
  state: {
    token: undefined,
    status: '',
    user: false,
  },
  mutations: {
    fetchToken(state) {
      state.token = localStorage.getItem('token') || false;
      let expire1Day = new Date();
      expire1Day.setTime(expire1Day.getTime() + (1 * 24 * 60 * 60));
      if (state.token) {
        document.cookie = `session_token=${state.token}; expires=${expire1Day.toUTCString()}; path=/api`;
      } else {
        document.cookie = `session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/api`;
      }
    },
    fetchUser(state) {
      fetch('/api/user.json')
        .then(res => res.json())
        .then(res => {
          state.user = res;
        }).catch(console.error);
    }
  },
  actions: {
    init({ commit, state }) {
      commit('fetchToken');
      if (state.token) {
        commit('fetchUser');
      }
    },
    login({ dispatch }, { email, password }) {
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
            dispatch('init');
            resolve(true);
          }).catch(err => {
            // DEBUG
            localStorage.setItem('token', 'hmmmok');
            dispatch('init');
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
      } catch (e) {
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
