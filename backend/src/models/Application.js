const mongoose = require('mongoose')
const validator = require('validator')

const applicationSchema = mongoose.Schema({
  //name: full name of user.
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },

  //email: unique email of user.
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({error: 'Invalid Email address'})
      }
    }
  },

  created_at: {
    type: Date
  },
  
  submission: {
    type: String,
    minlength: 100
  },

  approved: {
    type: Boolean,
    default: false
  }
})

const Application = mongoose.model('Application', applicationSchema)

module.exports = Application;