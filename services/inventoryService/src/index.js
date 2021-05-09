const express = require('express')
const bodyParser = require('body-parser')
const { body } = require('express-validator')
const { connect } = require('mongoose')
const { validateRequest, errorHandler } = require('./middleware/index')
const Article = require('./model/article')
const { updateOrCreateOne } = require('./article')
const app = express()
const PORT = 3000


app.set('trust proxy', 1)
app.use(bodyParser.json())
app.get('/heartbeat', (req, res) => res.status(200).send('Inventory Service is alive'))


app.post('/article', [
  body('id').notEmpty().withMessage('Article Id must be provided'),
  body('name').notEmpty().withMessage('Product name must be provided'),
  body('stock').notEmpty().isNumeric().withMessage('Article stock must be provided')
], validateRequest, async(req,res,next) => {
  try {

    const { id, name, stock } = req.body

    await updateOrCreateOne({ id, name, stock })

    // EMIT EVENT: InventoryUpdate
    
  } catch (err) {
      console.error(err)
      next(err)
  }

})
app.get('/articles', async (req, res, next) => {

    try {
        const previous = req.query.previous || ''
        // use previous otherwise set it to an old date so we get the first one
        const dateString = previous !== '' ? previous :'2010-07-21T12:01:35'

        const articles = Article.find({
            date: { $gt: ISODate(dateString)}
        }).sort({ date: 1}).limit(10)

        res.status(200).send({ articles })
        
    } catch (err) {
        console.error(err)
        next(err)
    }
})

app.use(errorHandler)

async function start() {
    try {
      await connect('mongodb://inventory-db-service:27017/inventory-db', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      console.log('Connected to the inventory-db')
    } catch (err) {
      console.error(err)
      console.log('Failed to connect to the inventory-db')
    }
    app.listen(PORT, () => {
      console.log(`Inventory service listening on port ${PORT}`)
    })
  }
  
  start()