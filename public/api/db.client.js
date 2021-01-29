require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
  name: {
    type: String,
    required: [true, 'Your name is required for registration'],
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        //return /\d{3}-\d{3}-\d{4}/.test(v);
        //console.log(phoneNumber(v).toJSON());
        //return phoneNumber(v).isPossible();
        console.log('validating phone', v)
        return true;
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'A phone number is required'],
  }
}

},{}],"backend/db":[function(require,module,exports){
// Bundle Up Client Validation
/*module.exports = {
  application: {
    Schema: require(`./user/application/schema.js`)
  }
}*/
/*let importer = (path, name) => {
  module.exports[name] = require('./' + path);
}

importer('user/application/schema.js', 'ApplicationSchema');*/

exports.ApplicationSchema = require('./user/application/schema.js');

},{"./user/application/schema.js":1}]},{},[]);
