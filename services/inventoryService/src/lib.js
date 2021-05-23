const { StringCodec } = require('nats')
const Article = require('./model/article')

const sc = StringCodec()

const updateArticleStock = async ({ id, amount }) => {
    console.log(`update article stock for article id ${id} and amount of ${amount}`)
    const existingArticle = await Article.findOne({ id })
    if (!existingArticle) throw new Error('Article no longer exists')
    const newStock = existingArticle.stock - amount
    // Do not let stock go negative!
    existingArticle.stock = newStock > 0 ? newStock : 0
    await existingArticle.save()
    return existingArticle
}
const updateOrCreateOne = async ({ id, name, stock }) => {

    const existingArticle = await Article.findOne({ id })

    let article

    if (existingArticle) {
        existingArticle.name = name
        existingArticle.stock = stock
        article = await existingArticle.save()
    } else {
        const newArticle = new Article({ id, name, stock })
        article = await newArticle.save()
    }

    return article
}

const updateInventory = async (event, eventBus) => {
    updateArticleStock(event.payload).then( article => {
        eventBus.publish("inventory", sc.encode(JSON.stringify({type: 'INVENTORY_UPDATED', payload: { id: article.id }})))
    }).catch( error => console.log(error))
}

module.exports = {
    updateInventory,
    updateOrCreateOne,
}