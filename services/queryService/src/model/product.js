const { Schema, model } = require('mongoose')

const ArticleSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
})

const productSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  articles: [ArticleSchema],
  quantity: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
}
)

const Product = model('Product', productSchema)

module.exports = Product