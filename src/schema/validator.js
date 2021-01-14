
import { model as Model, Schema } from 'mongoose';

let n = 0;
let validateParser = function(model, obj, paths) {
  let instance = new model(obj);
  if (paths) {
    if (paths instanceof String) {
      paths = [paths];
    }
  }
  return [instance, paths];
}
export const Validator = function(schema) {
  //let id = n++;
  let model = Model(`Validate_${n++}`, new Schema(schema));
  //console.log(model);
  return {
    Validate(...args) {
      let [ instance, paths ] = validateParser(model, ...args);
      return instance.validate(paths);
    },
    ValidateSync(...args) {
      let [ instance, paths ] = validateParser(model, ...args);
      return instance.validateSync(paths);
    },
  }
}
