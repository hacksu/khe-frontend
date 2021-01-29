
// Place empty object exports here
// These will be filled with content loaded from the backend
export let ApplicationSchema = {};



// Load up content from backend
import _ from 'lodash';
export default {
  install: (app) => {
    let merged = false;
    app.mixin({
      mounted() {
        if (!merged) {
          merged = true;
          let imported = window.require('backend/db');
          import('./backend.js').then(exports => {
            _.merge(exports, imported)
          })
        }
      }
    })
  },
}


import { model as Model, Schema } from 'mongoose'
// eslint-disable-next-line
let Models = {};
function mongooseModel(schema, values) {
  if (!(schema in Models)) {
    Models[schema] = {
      model: Model('Test', Schema(schema)),
      cache: {},
    };
  }
  if (!(values in Models[schema].cache)) {
    Models[schema].cache[values] = new (Models[schema].model)(values);
  } else {
    let model = Models[schema].cache[values];
    _.merge(model, values);
    return model;
  }
  return Models[schema].cache[values];
}
export function MongooseValidate(schema, values, paths) {
  return mongooseModel(schema, values).validate(paths)
}
export function MongooseValidateSync(schema, values, paths) {
  return mongooseModel(schema, values).validateSync(paths)
}
export function Validators(schema, determiner = false) {
  return {
    async validate(paths) {
      return await MongooseValidate(schema, determiner ? determiner(this) : this.data, paths);
    },
    // eslint-disable-next-line
    validateSync(paths) {
      return MongooseValidateSync(schema, determiner ? determiner(this) : this.data, paths);
    },
  }
}
