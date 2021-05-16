const express = require('express')
const { connect } = require('mongoose')
const Product = require('./model/product')
const { errorHandler } = require('./middleware')
const { updateProductView } = require('./lib')

const app = express()

const PORT = 3000


app.set('trust proxy', 1)
app.use(express.json())

app.get('/heartbeat', (req, res) => res.status(200).send('Query Service is alive'))


app.post('/update_products_view', async (req, res, next) => {

  try {

    console.log('Updating products_view on query service')

    const event = req.body

    console.log(event)

    if (!event.type) throw new Error()

    updateProductView(event)

    return res.status(200).send()

  } catch (error) {
    next(error)
  }
})


app.get('/products', async (req, res) => {

  try {

    console.log('fetching products from products_view')

    const perPage = 10

    const page = req.query.page || 0

    const skips = page === 0 ? 0 : (page * perPage)

    const total = await Product.countDocuments()

    const products = await Product.find().skip(skips).limit(perPage)

    res.status(200).send({ products, total })

  } catch (err) {
    console.error(err)
    next(err)
  }
})

app.use(errorHandler)

async function start() {
  try {
    await connect('mongodb://query-db-service:27017/products-view-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to the products-view-db')
  } catch (err) {
    console.error(err)
    console.log('Failed to connect to the products-view-db')
  }
  app.listen(PORT, () => {
    console.log(`Query service listening on port ${PORT}`)
  })
}

start()