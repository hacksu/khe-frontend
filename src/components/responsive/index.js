import { ref } from 'vue';

let tabletWidth = 768;
let desktopWidth = 1024;

let vars = {
  mobile: false,
  tablet: false,
  desktop: false,
}

let APP;
let compute = function() {
  let width = window.innerWidth;
  console.log('computing');
  vars.mobile = (width < tabletWidth);
  vars.tablet = (width >= tabletWidth && width < desktopWidth);
  vars.desktop = (width >= desktopWidth);
  /*if (APP) {
    requestAnimationFrame(function() {
      APP._container._vnode.component.proxy.$nextTick();
    })
  }*/
}

compute();
/*for (let i in vars) {
  vars[i] = ref(vars[i]);
}*/

window.addEventListener('resize', compute);

export default {
  install(app) {
    APP = app;
    app.mixin(this);
  },
  computed: {
    $display() {
      vars.mobile;
      vars.tablet;
      vars.desktop;
      window.innerWidth;
      return vars;
    }
  },
}
