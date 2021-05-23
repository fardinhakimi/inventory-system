const { StringCodec } = require('nats')
const { body } = require('express-validator')
const { validateRequest, errorHandler } = require('./middleware/index')
const Product = require('./model/product')

const sc = StringCodec()

module.exports = function(app, eventBus) {

    app.get('/', (req, res) => res.status(200).send('Product Service is alive'))

    app.get('/sell', async (req, res, next) => {

        try {

            if (!req.query.id) throw new Error('id is missing')

            const id = req.query.id

            console.log(`Selling product with id of ${id}`)
            
            const product = await Product.findOne({ id })
            
            if (!product) throw new Error(`No such product found: ${id}`)

            if (product.articles) {
                for (article of product.articles) {
                    console.log('Emit event: ARTICLE_SOLD')
                    eventBus.publish("inventory", sc.encode(JSON.stringify({type: 'ARTICLE_SOLD', payload: article})))
                }
            }

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

        console.log('Emit event: PRODUCT_CREATED')
        eventBus.publish("inventory", sc.encode(JSON.stringify({type: 'PRODUCT_CREATED', payload: product})))

        return res.status(200).send()

    } catch (err) {
        next(err)
    }

    return res.status(201).send({ product })
    })

    app.use(errorHandler)
}