const express = require('express')
const { body } = require('express-validator')
const bodyParser = require('body-parser')
const { connect } = require('mongoose')
const { validateRequest, errorHandler } = require('./middleware/index')
const Product = require('./model/product')

const app = express()
const PORT = 3000

app.use(bodyParser.json())
app.get('/heartbeat', (req, res) => res.status(200).send('Product Service is alive'))

/**
 * Endpoint responsible for creating a single product
 */
app.post('/product',[
  body('name').notEmpty().withMessage('Product name must be provided'),
  body('price').notEmpty().withMessage('Price must be provided'),
  body('articles').exists().withMessage('Articles must be provided'),
  body('articles.*.id').notEmpty().isString().withMessage('Article id must be provided'),
  body('articles.*.amount').notEmpty().isNumeric().withMessage('Article amount must be provided'),
], validateRequest, async (req, res, next ) => {

  try {

    const product = new Product(req.body)
    await product.save()
    // EMIT EVENT -> ProductCreated
    
  } catch (err) {
    next(err)
  }

  return res.status(201).send({ products })
})

app.use(errorHandler)

async function start() {
  try {
    await connect('mongodb://products-db-service:27017/products', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to the product-db')
  } catch (err) {
    console.error(err)
    console.log('Failed to connect to the product db')
  }
  app.listen(PORT, () => {
    console.log(`Products service listening on port ${PORT}`)
  })
}

start()