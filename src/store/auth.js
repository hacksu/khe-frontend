let TOKEN = 'token';
let REGISTERED_TOKEN = 'KHE_FRONTEND_ACCOUNT_REGISTERED';
Object.defineProperties(window, {
  'REGISTERED': { // Has the user made an account or logged in before?
    get() {
      return localStorage.getItem(REGISTERED_TOKEN) ? true : false;
    },
  },
  'AUTHENTICATED': { // Is the user currently logged in?
    get() {
      return localStorage.getItem(TOKEN) ? true : false;
    },
  }
})

export default {
  state: () => ({
    token: localStorage.getItem(TOKEN) || false,
  }),
  mutations: {
    fetchToken(state) { // Fetch session token and update cookie
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
        // Due to token based authentication,
        // we just reupload the token to keep the session alive.
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
      //console.log({ login: data, })
      if (data.success) {
        if ('token' in data) {
          localStorage.setItem(TOKEN, data.token);
          commit('fetchToken');
          localStorage.setItem(REGISTERED_TOKEN, 'true');
        }
        return true;
      } else {
        if (data.error.includes('does not exist')) {
          // remove token as its obviously invalid
          localStorage.removeItem(TOKEN);
          commit('fetchToken');
          return;
        }
        throw new Error(data.error);
      }

    },
    async logout({ commit }) {
      let token = localStorage.getItem(TOKEN);
      if (token) {
        localStorage.removeItem(TOKEN);
        commit('fetchToken');
        return await (await fetch(`/api/user/logout?token=${token}`)).json();
      }
    },
    async register({ commit }, body) {
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
