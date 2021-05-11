const express = require('express')
const { body } = require('express-validator')
const bodyParser = require('body-parser')
const { connect } = require('mongoose')
const { validateRequest, errorHandler } = require('./middleware/index')
const { updateProductsView, updateInventory } = require('./lib')
const Product = require('./model/product')

const app = express()
const PORT = 3000


app.use(bodyParser.json())

app.get('/heartbeat', (req, res) => res.status(200).send('Product Service is alive'))

app.get('/sell', async (req, res, next) => {

  try {

    if (!req.query.id) throw new Error('id is missing')

    const id = req.query.id

    const product = await Product.findOne({ id })

    if (!product) throw new Error(`No such product found: ${id}`)
    // Do not wait for this and continue
    // This should be refactored and be an event instead going to the event bus.
    updateInventory(product)

    return res.status(200).send()

  } catch (error) {
    next(error)
  }
})

/**
 * Endpoint responsible for creating a single product
 */
app.post('/product', [
  body('id').notEmpty().isString().withMessage('id must be provided'),
  body('name').notEmpty().withMessage('name must be provided'),
  body('price').notEmpty().isNumeric().withMessage('price must be provided'),
  body('articles').exists().withMessage('articles must be provided'),
], validateRequest, async (req, res, next) => {

  try {

    const { id, name, price, articles } = req.body

    const existingProduct = await Product.findOne({ id })

    let product = null

    if (existingProduct) {
      existingProduct.name = name
      existingProduct.price = price
      existingProduct.articles = articles
      product = await existingProduct.save()
    } else {
      const newProduct = new Product(req.body)
      product = await newProduct.save()
    }

    updateProductsView(product)

    return res.status(200).send()

  } catch (err) {
    next(err)
  }

  return res.status(201).send({ product })
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