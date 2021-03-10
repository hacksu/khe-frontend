
import _ from 'lodash';
import DatabaseClient from '@/db';
let { ApplicationSchema } = DatabaseClient;
console.log({ ApplicationSchema })

const flattenObject = (obj = {}, doArrays=false) => {
  const result = {};

  const flatten = (collection, prefix = '', suffix = '') => {
    _.forEach(collection, (value, key) => {
      const path = `${prefix}${key}${suffix}`;

      if (doArrays && _.isArray(value)) {
        flatten(value, `${path}.`);
      } else if (_.isPlainObject(value) && !('type' in value)) {
        flatten(value, `${path}.`);
      } else {
        result[path] = value;
      }
    });
  };

  flatten(obj);

  return result;
};


import mongoose from 'mongoose';
export let Validate = function(schema, fields, paths=false) {
  return new Promise(resolve => {
    if (!paths) {
      paths = flattenObject(fields)
    } else {
      paths = Object.fromEntries(paths.map(key => [key, _.get(fields, key)]));
      let newFields = {};
      for (let key in paths) {
        _.set(newFields, key, paths[key])
      }
      fields = newFields;
    }

    let filteredSchema = {};
    for (let x in paths) {
      _.set(filteredSchema, x, _.get(schema, x))
    }
    let Schema = new mongoose.Schema(filteredSchema);
    let Model = mongoose.model('', Schema);
    let doc = new Model(fields);
    doc.validate(function(err) {
      if (!err) {
        err = {
          errors: {},
        }
      };
      let { errors } = err;
      resolve(Object.fromEntries(Object.entries(flattenObject(fields, true)).map(([key, value]) => [key, {
        valid: !(key in errors),
        invalid: (key in errors),
        message: errors[key] ? errors[key].message : undefined,
        value,
      }])))
    })
  })
}
export let Validator = function(schema) {
  return function(...args) {
    return Validate(schema, ...args);
  }
}


Validate(ApplicationSchema, {
  phone: '123',
  education: {
    major: 'yea',
    school: 'ok',
  },
  dietary: [
    'Vegan',
    'def',
  ]
}).then(console.log);

Validate(ApplicationSchema, {
  phone: '+1 123 1234 1234',
  education: {
    major: 'yea',
    school: 'ok',
  },
  dietary: [
    'abc',
    'def',
  ]
}, ['phone']).then(console.log);


let ApplicationValidator = Validator(ApplicationSchema);
ApplicationValidator({
  phone: '123',
}).then(console.log);

//console.log(flattenObject(ApplicationSchema));
