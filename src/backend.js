
// Place empty object exports here
// These will be filled with content loaded from the backend
// Whatever you export on the backend inside db/client.js, redefine a placeholder here.
export let ApplicationSchema = {};



// Load up remote content from backend on runtime
import _ from 'lodash';
export default {
  install: (app) => {
    let merged = false;
    app.mixin({
      mounted() {
        if (!merged) {
          merged = true;
          // fetch from browserify
          let imported = window.require('backend/db');
          // get exports from this file
          import('./backend.js').then(exports => {
            // merge remote exports into local placeholders
            _.merge(exports, imported)
          })
        }
      }
    })
  },
}


// Validators
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
