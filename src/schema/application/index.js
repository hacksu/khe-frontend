
export const State = {
  name: null,
  phone: null,
  bruh: {
    ok: null,
  }
}

export const Schema = {
  name: {
    type: String,
    required: [true, 'Please enter your name!'],
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
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  },
  bruh: {
    ok: {
      type: String,
      required: true,
    },
  },
}

import { Validator } from '../validator'
export const Validators = Validator(Schema);
export const Validate = Validators.Validate;

export default {
  Schema,
  State,
  ...Validators,
}
