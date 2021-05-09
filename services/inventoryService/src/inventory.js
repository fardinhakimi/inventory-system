const Article = require('./model/article')

const updateOne = (article) => {
    const { id, stock } = article
    const existingArticle = await Article.findOne({ id })
    if(!existingArticle) throw new Error('Article no longer exists')
    existingArticle.stock = (existingArticle.stock - stock)
    await existingArticle.save()
}
const updateOrCreateOne = async (article) => {

    const { id, name, stock } = article
    try {
        const existingArticle = await Article.findOne({ id })
        if(existingArticle) {
            existingArticle.name = name
            existingArticle.stock = stock
            await existingArticle.save()
        } else {
            const newArticle = new Article({ id, name, stock})
            await newArticle.save()
        }
        
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = { 
    updateOne,
    updateOrCreateOne
}