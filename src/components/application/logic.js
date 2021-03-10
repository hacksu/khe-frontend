import { Application } from './application';

import { set, ref } from 'vue';
import { withDirectives, resolveDirective } from 'vue';

window.$application = Application;



let messages = {

}

export let directives = {
  application: {
    mounted(el, binding, vnode) {
      console.log({ el, binding, vnode });
      let path = Object.keys(binding.modifiers).join('.');
      el.classList.add(`application-field-${path.split('.').join('-')}`);
      let component = binding.instance;
      binding.values = {
        events: {},
      }
      let lastValue = Application.get(path);
      binding.values.watcher = setInterval(function() {
        let newValue = Application.get(path);
        if (newValue != lastValue) {
          el.value = newValue || '';
          lastValue = newValue;
        }
      }, 200);
      el.value = lastValue || "";
      let events = binding.values.events;
      let inputting;
      let finishedInput = function() {
        console.log('finished');
        Application.set(path, el.value);
        Application.validate(function(err) {
          console.log(JSON.parse(JSON.stringify(err)));
          if (err) {
            component.invalid = err.errors;
          } else {
            component.invalid = {};
          }
          if (path in component.invalid) {
            el.classList.add('invalid')
          } else {
            el.classList.remove('invalid')
          }
        })
      }
      events.input = function(event) {
        //console.log(event);
        component.invalid = {};
        if (inputting) clearTimeout(inputting);
        if (event.type == 'change') {
          finishedInput();
          return;
        }
        inputting = setTimeout(finishedInput, 500);
      }
      events.change = events.input;
      for (let x in events) {
        el.addEventListener(x, events[x])
      }
      /*let component = binding.instance;

      binding.instance.$watch('Application._doc.phone', function(a, b) {
        console.log('okay', {a, b})
      });
      el.addEventListener('change', function(event) {
        Application.validate(function(err) {
          console.log(JSON.parse(JSON.stringify(err)));
          if (err) {
            component.invalid = err.errors;
            console.log(component.invalid);
          } else {
            component.invalid = {};
          }
        })
      })*/
      //console.log(Object.keys(binding.modifiers))
      //vnode.phone = '123';
      //let val = Application
      //console.log(Application);
      //console.log(, Application.phone);
      //let path = Object.keys(binding.modifiers).join('.');
      //el.value = Application.get(path) || '';
      //console.log(Application.get(path.split('.').slice(0, -1).join('.')));
      //el.addEventListener('input', function(event) {
        //Application.set(path, event.target.value);
      //})
      /*vnode.field = Application.phone;
      console.log(Object.keys(binding.modifiers))
      console.log(this);
      console.log({ el, binding, vnode });
      //console.log(binding.instance.$attrs['v-model'] = 'Application.phone');
      //withDirectives(vnode);
      //console.log(binding.instance.$set('hi'));
      //set(binding.instance, 'v-model', Application._id)
      vnode.render = function() {
        console.log('OMG')
      }*/
    },
    beforeUnmount(el, binding, vnode) {
      clearInterval(binding.values.watcher);
      let events = binding.values.events;
      for (let x in events) {
        el.removeEventListener(x, events[x])
        console.log('removed ', x)
      }
      console.log('CLEARED WATCHER')
    },
  }
};

export let setup = function(props) {
  let invalid = {};
  return {
    invalid,
    Application,
    validate: function() {
      //console.log(Application);
      Application.validate(function(err) {
        console.log(err);
      })
    },

  }
}
