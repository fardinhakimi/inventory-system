const express = require('express')
const mongoose = require('mongoose')
const { connect } = require('nats')
const server = require('../../inventoryService/src/server')
const messageHandler = require('./messageHandler')
const app = express()
const PORT = 3000

app.use(express.json())

async function start() {

  try {
    await mongoose.connect('mongodb://products-db-service:27017/products', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    const nc = await connect({ servers: "nats:4222" })
    const sub = nc.subscribe("inventory")
    messageHandler(nc, sub)
    server(app, nc)
    console.log('Connected to nats server')
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