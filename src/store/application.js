import { createStore } from 'vuex'
import { merge } from 'lodash'
import { app } from '@/main';
import { ApplicationSchema, MongooseValidate } from '@/backend'

let ApplicationState;
let cachedState;
let validationErrors = {};
let updateErrorTags;
export let store = createStore({


  mutations: {
    cache(state) {
      cachedState = JSON.stringify(state);
    },
    set(state, content = false) {
      if (!content) {
        if (cachedState) {
          content = JSON.parse(cachedState)
        } else {
          return;
        }
      }
      for (let key in state) {
        delete state[key];
      }
      Object.assign(state, content);
    }
  },
  actions: {
    validate(_, ...args) {
      // args =
      //  a. SomeStateObject, Paths
      //  b. Paths to check
      //  c. (nothing, then whole application is checked)
      if (args.length <= 1) {
        args.unshift(ApplicationState)
      }
      if (args.length >= 2) {
        if (typeof (args[1]) == 'string') {
          args[1] = [args[1]];
        }
      }
      return new Promise(function(resolve, reject) {
        let paths = args.length >= 2 ? args[1] : Object.keys(validationErrors);
        MongooseValidate(ApplicationSchema, ...args).then((...passed) => {
          // clear errors on checked paths
          for (let path of paths) {
            validationErrors[path] = true;
          }
          updateErrorTags();
          resolve(...passed);
        }).catch((err) => {
          for (let path of paths) {
            validationErrors[path] = true;
          }
          let { errors } = err;
          for (let key in errors) {
            validationErrors[key] = errors[key]
          }
          updateErrorTags();
          reject(err);
        })
      })
      //return MongooseValidate(ApplicationSchema, ...args)
    },
    load({ state, commit }) {
      return fetch('/api/user/application.json')
        .then(res => res.json())
        .then(res => {
          commit('set', res);
          if (!('created' in state)) {
            state.created = new Date();
          }
          commit('cache');
        })
    },
    save({ state, commit }) {
      return fetch('/api/user/application.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state)
      })
        .then(res => res.json())
        .then(res => {
          commit('set', res);
          if (!('created' in state)) {
            state.created = new Date();
          }
          commit('cache');
        })
    },
    discard({ commit }) {
      commit('set', JSON.parse(cachedState));
    }

  },
  getters: {
    loaded: state => state.created || false,
    modified: state => cachedState && JSON.stringify(state) != cachedState,
  },
})

ApplicationState = store.state;

window.hmm = store;

export let logic = {
  computed: {
    loaded() {
      return this.application.getters.loaded;
    },
    modified() {
      return this.application.getters.modified;
    }
  },
  methods: {
    path(str) {
      return [this.application, str];
    },
  },
}

export function setup() {
  return {
    application: store,
    state: store.state,
  }
}


export function extend(component) {
  return merge(component, logic);
}


let validationErrorTags = document.createElement('style');
document.head.appendChild(validationErrorTags);
updateErrorTags = function() {
  validationErrorTags.innerHTML = Object.entries(validationErrors).map(([path, err]) => {
    let path2 = path.split('.').join('-');
    if (err === true) {
      ([...document.querySelectorAll(`.application-validate-${path2}`)]).forEach(o => {
        o.classList.add('valid');
        o.classList.remove('invalid');
      })
      return;
    }
    ([...document.querySelectorAll(`.application-validate-${path2}`)]).forEach(o => {
      o.classList.add('invalid');
      o.classList.remove('valid');
    })
    return `
    .application-validate-${path2}::after {
      content: "${err.message}"
    }
    `
  }).filter(o => o)
}

let executeValidate = function(evt, run = true) {
  let { target: el } = evt;
  if (!run) {
    el.classList.remove('invalid', 'valid')
    if (el.dataset.path in validationErrors) {
      delete validationErrors[el.dataset.path];
      updateErrorTags();
    }
  } else {
    store.dispatch('validate', el.dataset.path).catch(() => {
      console.log('Invalid')
    })
  }
}
let validateListener = function(evt) {
  let { type, target: el } = evt;
  if (type == 'input') {
    if (el.classList.contains('invalid')) {
      // remove validation, just started typing
      executeValidate(evt, false);
    } else {
      if ('delayedValidate' in el.dataset) {
        clearTimeout(el.dataset.delayedValidate)
      }
      el.dataset.delayedValidate = setTimeout(function() {
        executeValidate(evt);
      }, 1000)
    }
  } else {
    executeValidate(evt);
  }
}
app.directive('validate', {
  mounted(el, binding) { // vnode
    let { value } = binding;
    if (value) {
      if (value instanceof Array) {
        let [store_, path] = value;
        if (store_ == store) {
          el.classList.add(`application-validate-${path.split('.').join('-')}`)
          el.dataset.path = path;
          el.addEventListener('input', validateListener);
          el.addEventListener('change', validateListener);
          if (el.value) {
            executeValidate({
              target: el,
            })
          }
        }
      }
    }
  }
})



export default {
  store,
  logic,
  setup,
}
