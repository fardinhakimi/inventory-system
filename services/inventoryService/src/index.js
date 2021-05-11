const express = require('express')
const bodyParser = require('body-parser')
const { body } = require('express-validator')
const { connect } = require('mongoose')
const { validateRequest, errorHandler } = require('./middleware/index')
const Article = require('./model/article')
const { updateOrCreateOne, updateArticleStock, updateProductsView } = require('./lib')
const app = express()
const PORT = 3000
app.set('trust proxy', 1)
app.use(bodyParser.json())
app.get('/heartbeat', (req, res) => res.status(200).send('Inventory Service is alive'))

/**
 * Used when a sell is made / product is removed and the inventory needs to be updated
 */
app.post('/update_inventory', async (req, res, next) => {

  try {

    console.log(' updating the inventory ', { event })

    const event = req.body

    if (event.type === 'ARTICLE_SOLD') {
      const updateArticle = await updateArticleStock(event.payload)
      updateProductsView(updateArticle.id)
    }

  } catch (err) {
    console.error(err)
    next(err)
  }

  return res.status(200).send()

})

app.get('/article/:id', async (req, res, next) => {

  try {

    console.log(' fetching single article ')

    if (!req.params.id) throw new Error()

    const id = req.params.id

    const article = await Article.findOne({ id })

    if (!article) throw new Error()

    return res.status(200).send(article)

  } catch (error) {
    next(error)
  }

})

app.post('/article', [
  body('id').notEmpty().withMessage('id must be provided'),
  body('name').notEmpty().withMessage('name must be provided'),
  body('stock').notEmpty().isNumeric().withMessage('stock must be provided')
], validateRequest, async (req, res, next) => {
  try {

    console.log(' creating single article ')

    console.log(req.body)

    const { id } = await updateOrCreateOne(req.body)
    updateProductsView(id)

    return res.status(200).send()

  } catch (err) {
    console.error(err)
    next(err)
  }
})
app.get('/articles', async (req, res, next) => {

  try {
    console.log(' fetching paginated articles ')
    console.log(req.query)

    const perPage = 10

    const page = req.query.page || 0

    const skips = page === 0 ? 0 : (page * perPage)

    const total = await Article.countDocuments()

    const articles = await Article.find().skip(skips).limit(perPage)

    res.status(200).send({ articles, total })

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