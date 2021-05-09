const express = require('express')
const bodyParser = require('body-parser')
const { connect } = require('mongoose')
const Product = require('./model/product')
const { errorHandler } = require('./middleware')
const app = express()

const PORT = 3000


app.set('trust proxy', 1)
app.use(bodyParser.json())

app.get('/heartbeat', (req, res) => res.status(200).send('Query Service is alive'))
app.get('/products', async (req, res) => {

    try {
        const previous = req.query.previous || ''
        // use previous otherwise set it to an old date so we get the first one
        const dateString = previous !== '' ? previous :'2010-07-21T12:01:35'

        const products = Product.find({
            date: { $gt: ISODate(dateString)}
        }).sort({ date: 1}).limit(10)

        res.status(200).send({ products })
        
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