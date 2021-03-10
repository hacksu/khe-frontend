
import DatabaseClient from '@/db';
let { ApplicationSchema, Validate } = DatabaseClient;
console.log({ ApplicationSchema, Validate })

import mongoose from 'mongoose';
let Model = mongoose.model('Application', ApplicationSchema);

let valid = {

}

let application = new Model({

})

fetch('/api/application.json').then(res => res.json()).then(data => {
  //delete application.user;
  Object.assign(application, data);
  let user = data.user;
  console.log(application);
  delete user._id;
  Object.assign(application.user.__proto__, user);
  //let a = Validate(ApplicationSchema.phone);
  //a('440-226-1337')
  console.log(application);
})


export default application;
export let Valid = valid;
