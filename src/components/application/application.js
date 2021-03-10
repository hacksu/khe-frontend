
import DatabaseClient from '@/db';
let { ApplicationSchema } = DatabaseClient;
console.log({ ApplicationSchema })

import mongoose from 'mongoose';
let Model = mongoose.model('Application', ApplicationSchema);

let valid = {

}

let application = new Model({

})

console.log(application)

let validate = function(paths) {
  console.log(paths);
  application.validate(paths, function(err) {
    console.log(err);
  })
}

import { ref } from 'vue'
export let Ready = ref(false);
fetch('/api/application.json').then(res => res.json()).then(data => {
  //delete application.user;
  Object.assign(application, data);
  let user = data.user;
  delete user._id;
  Object.assign(application.user.__proto__, user);
  Ready.value = true;
  console.log(Ready);
  //let a = Validate(ApplicationSchema.phone);
  //a('440-226-1337')
  console.log(application);
})


export default application;
export let Application = application;
export let Validate = validate;
