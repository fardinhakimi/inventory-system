const { body } = require('express-validator')
const { StringCodec } = require('nats')
const { validateRequest, errorHandler} = require('./middleware/index')
const Article = require('./model/article')
const { updateOrCreateOne } = require('./lib')

module.exports = function(app, eventBus){
    
    const sc = StringCodec()

    app.get('/heartbeat', (req, res) => res.status(200).send('Inventory Service is alive'))
      
      app.get('/article', async (req, res, next) => {
      
        try {
      
          console.log(' fetching single article ')
      
          if (!req.query.id) throw new Error('Missing id')
      
          const id = req.query.id
      
          const article = await Article.findOne({ id })
      
          if (!article) throw new Error()
      
          console.log(` Retrieved article for article id (${id})`)
      
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

          console.log(`Publish event: INVENTORY_UPDATED`)
          eventBus.publish("inventory", sc.encode(JSON.stringify({type: 'INVENTORY_UPDATED', payload: { id }})))
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
}