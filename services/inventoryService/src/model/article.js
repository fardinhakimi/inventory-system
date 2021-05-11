const { Schema, model } = require('mongoose')

const articleSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now
    },
  }
)

const Article = model('Article', articleSchema)

module.exports = Article