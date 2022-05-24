const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },

  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true
  },

  password: {
    type: String,
    requred: [true, 'Please add a password of minimum 7 characters'],
    minlength: 7
  },

  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Blog'
    }
  ]
})

module.exports = mongoose.model('User', userSchema)
