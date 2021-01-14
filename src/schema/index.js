
import { model as Model, Schema } from 'mongoose'

console.log(Document.prototype.__proto__.validate);

//console.log(new (mongoose.model)('model', {}));

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
  }
  return Models[schema].cache[values];
}
export function MongooseValidate(schema, values, paths) {
  return mongooseModel(schema, values).validate(paths)
}
export function MongooseValidateSync(schema, values, paths) {
  console.log('BRUH', schema, values, paths);
  return mongooseModel(schema, values).validateSync(paths)
}
/*
export function aMongooseValidate(schema, values, paths) {
  let model = mongooseModel(schema, values);
  return Promise.all(paths.map(o => model.path(o).validate(resolve, function() {
    console.log('RIP VALIDATION FAILED', )
  })));
  return mongooseModel(schema, values).validate(paths)
}
export function aMongooseValidateSync(schema, values, paths) {
  console.log('BRUH', schema, values, paths);
  return mongooseModel(schema, values).validateSync(paths)
}
*/

export function oldMongooseValidate(schema, values, paths) {
  if (!(schema in Models)) {
    Models[schema] = Model('Test', Schema(schema));
  }
  const model = new Models[schema](values);
  return model.validate(paths);
}
export function oldMongooseValidateSync(schema, values, paths) {
  if (!(schema in Models)) {
    Models[schema] = Model('Test', Schema(schema));
  }
  const model = new Models[schema](values);
  return model.validateSync(paths);
}
export function Validate(schema, value) {
  console.log('trying to validate', value, 'against', schema);
  return true;
}
