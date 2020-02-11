const mongoose = require('mongoose')

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
  }
})

const Application = mongoose.model('Article', applicationSchema)

module.exports = Application;