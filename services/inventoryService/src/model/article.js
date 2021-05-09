import { Schema, model } from 'mongoose'

const Schema = new Schema(
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

const Article = model('Article', Schema)

module.exports = Article