const express = require('express')
const mongoose = require('mongoose')
const { connect } = require("nats")
const Product = require('./model/product')
const { errorHandler } = require('./middleware')
const messageHandler = require('./messageHandler')

const app = express()

const PORT = 3000


app.set('trust proxy', 1)
app.use(express.json())

app.get('/heartbeat', (req, res) => res.status(200).send('Query Service is alive'))

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
    await mongoose.connect('mongodb://query-db-service:27017/products-view-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    const nc = await connect({ servers: "nats:4222" })
    const sub = nc.subscribe("inventory")
    messageHandler(nc, sub)
    console.log('Connected to the products-view-db')
    console.log('Connected to nats server')
  } catch (err) {
    console.error(err)
    console.log('Failed to connect to the products-view-db')
  }
  app.listen(PORT, () => {
    console.log(`Query service listening on port ${PORT}`)
  })
}

start()