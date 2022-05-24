const mongoose = require('mongoose')

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    image: {
      type: String,
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },

  {
    timespan: true
  }
)

module.exports = mongoose.model('Blog', blogSchema)
