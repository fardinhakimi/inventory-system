const Article = require('./model/article')
const fetch = require('node-fetch')

const updateArticleStock = async ({ id, amount }) => {
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

const updateProductsView = (id) => {
    // We do not care about the response
    fetch('http://query-service:3000/update_products_view', {
        method: 'post',
        body: JSON.stringify({ type: 'INVENTORY_UPDATED', payload: { id } }),
        headers: { 'Content-Type': 'application/json' }
    }).catch(err => {
        console.error(err)
        console.error('Failed to update products_view')
    })
}

module.exports = {
    updateProductsView,
    updateArticleStock,
    updateOrCreateOne
}