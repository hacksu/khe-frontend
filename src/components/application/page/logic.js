import _ from 'lodash';
export const logic = {
  props: {
    application: Object,
    name: String,
  },
  mounted() {
    console.log('yeee')
    this.$parent.pages_[this.name] = this;
  },
};
export const inherit = function(component) {
  return _.mergeWith(component, logic, function(objValue, srcValue) {
    let typ = typeof(srcValue);
    if (typ == 'function' && typeof(objValue) == 'function') {
      let a = srcValue;
      let b = objValue;
      return function(...args) {
        let av = a.apply(this, args);
        let bv = b.apply(this, args);
        if (av != undefined) {
          return av;
        }
        return bv;
        /*return b.apply({
          'super': b,
          __proto__: this,
        }, args);*/
      }
    }
    return srcValue;
  })
}
