const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
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

  //password: password of user, encrypted by bcrypt.
  password: {
    type: String,
    required: true,
    minLength: 7
  },

  //bio: string bio of the user. Max length 400.
  bio: {
    type: String,
    maxLength: 400
  },

  created_at: {
    type: Date
  },

  //admin: true if admin.
  level: {
    type: Number
  },

  //portfolios: array of portfolio ids owned by the user.
  portfolios: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio'
  }],

  //tokens: array of active authentication tokens.
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
})

userSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this
  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

userSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this
  const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await User.findOne({ email} )
  if (!user) {
      throw new Error('Invalid login credentials')
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
      throw new Error('Invalid login credentials')
  }
  return user
}

const User = mongoose.model('User', userSchema)

module.exports = User