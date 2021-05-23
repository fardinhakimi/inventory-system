const express = require('express')
const mongoose = require('mongoose')
const { connect } = require("nats")
const messageHandler = require('./messageHandler')
const server = require('./server')

const app = express()
const PORT = 3000
app.set('trust proxy', 1)
app.use(express.json())

async function start() {
  try {

    await mongoose.connect('mongodb://inventory-db-service:27017/inventory-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('Connected to the inventory-db')

    const nc = await connect({ servers: "nats:4222" })
    const sub = nc.subscribe("inventory")
    messageHandler(nc, sub)
    server(app, nc)
  } catch (err) {
    console.error(err)
    console.log('Failed to connect to the inventory-db')
  }
  app.listen(PORT, () => {
    console.log(`Inventory service listening on port ${PORT}`)
  })
}

start()