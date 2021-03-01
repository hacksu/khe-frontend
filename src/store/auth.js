let TOKEN = 'token';
export default {
  state: () => ({
    token: localStorage.getItem(TOKEN) || false,
  }),
  mutations: {
    fetchToken(state) {
      state.token = localStorage.getItem(TOKEN) || false;
      let expire1Day = new Date();
      expire1Day.setTime(expire1Day.getTime() + (1 * 24 * 60 * 60 * 1000));
      if (state.token) {
        document.cookie = `frontend_session_token=${state.token}; expires=${expire1Day.toUTCString()}; path=/api`;
      } else {
        document.cookie = `frontend_session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/api`;
      }
    }
  },
  actions: {
    async login({ commit, state }, body) {
      console.log('TRYING TO LOGIN')
      if (body == 'session' && state.token) {
        let token = state.token;
        body = {
          token,
        }
      }
      let data = await (await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })).json();
      console.log({ login: data, })
      if (data.success) {
        if ('token' in data) {
          localStorage.setItem(TOKEN, data.token);
          commit('fetchToken');
        }
        return true;
      } else {
        throw new Error(data.error);
      }

    },
    async logout({ commit, state }) {
      let token = state.token;
      if (token) {
        localStorage.removeItem(TOKEN);
        commit('fetchToken');
        fetch(`/api/user/logout?token=${token}`)
      }
    },
    async register({ commit, state }, body) {
      let data = await (await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })).json();
      console.log({ register: data, })
      if (data.success) {
        if ('token' in data) {
          localStorage.setItem(TOKEN, data.token);
          commit('fetchToken');
        }
      }
    },
  },
  getters: {
    loggedIn: state => state.token ? true : false,
  },
}
