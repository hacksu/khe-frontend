
export const State = {
  name: null, // first and last name
  gender: null, // gender
  age: null, // age
  phone: null, // phone
  education: {
    school: null, // school or university
    major: null, // major or focus
    standing: null, // highschool, sophomore, senior, grad student, etc

  },
  newbie: null, // first time hacker
  conduct: null, // agreed to code of conduct
  demographic: null, // agree to send demographic data to MLH
  travel: null, // needs travel reimbursement
  size: null, // clothing size for swag
  american: null, // does this person live in the US?
  region: null, // state or province for tracking how far khe reaches across the world
  dietary: false, // dietary restrictions
  //waiver: false, // minor waiver
  bruh: {
    ok: null,
  }
}

export const Schema = {
  name: {
    type: String,
    validate: {
      validator: function(v) {
        // separate full name by spaces
        // remove ones that are less than 1 char
        // must have at least 2 1-letter or more words
        // total length must be at least 5 to be valid
        let splt = v.split(' ').filter(o => o.length >= 1);
        return splt.length >= 2 && v.length >= 5;
      },
      message: () => `Please enter a first and last name!`,
    },
    required: [true, `Please enter your name!`],
  },
  gender: {
    enum: [ 'M', 'F', '-', String ],
  },
  age: {
    type: Number,
    validate: {
      validator: function(v) {
        return v > 13;
      },
      message: () => `Sorry, you are too young to participate!`,
    },
    required: [true, 'Please enter your age!'],
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
  /*waiver: {
    enum: [ String, Boolean ],
    validate: {
      validator: function(v) {
        // if age < 18, default value of false won't validate
        // minors will be required to upload waiver
        // this property will be assigned the file id
        if (this.age < 18) {
          return typeof(v) == 'string'
        }
        return true
      }
    },
    required: true,
  },*/
  bruh: {
    ok: {
      type: String,
      required: true,
    },
  },
}


export default {
  Schema,
  State,
}
