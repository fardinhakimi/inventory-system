const fetch = require('node-fetch')
const Product = require('./model/product')

const fetchArticleStock = async (articleId) => {

    try {
        console.log(` fetching stock for article (${articleId})`)
        const response = await fetch(`http://inventory-service/article/${articleId}`)
        const article = await response.json()
        return article.stock

    } catch (error) {
        console.log(error)
        console.log(' Failed to get stock for article')
        return -1
    }
}

const updateProductView = (event) => {

    console.log('updateProductView: ', { event })

    switch (event.type) {
        case 'PRODUCT_CREATED':
            pushProductToView(event.payload)
            break;
        case 'INVENTORY_UPDATED':
            updateQuantityForProducts(event.payload.id)
            break
    }
}

const updateProductQuantity = async (product, quantity) => {
    console.log(`updating product quantity for ${product.name} (${product.id})`)
    product.quantity = quantity
    product.save().then(data => console.log('quantity updated')).catch(err => console.error(err.message))
}

const updateQuantityForProducts = (id) => {

    console.log(`updating product quantity for all products containing an article with id of ${id}`)

    // find all products which contain this article and update their quantity

    Product.find({ 'articles.id': id }, async (err, products) => {

        if (!products) return

        for (product of products) {
            const quantity = await calculateQantityForProduct(product)
            // update product with new quantity
            // we do not really have to wait for updateProductQuantity to finish
            if (quantity !== -1) updateProductQuantity(product, quantity)
        }
    })
}


/**
 * 
 * How is a quantity defined for a prodcut? 
 * 
 * Suppose we have 4 legs and 2 table tops, with these articles with can make a minimum of one table. 
 * so if we have two products with different ids each requring a table top and 4 legs, 
 * then we can build a minimum of 1 table of each. 
 * so the quantity for each product would endup being 1. 
 * Given if we sell one of them the quantity for the other one would be updated to 0 , 
 * because we can not make a table with a top without its legs. 
 */
const calculateQantityForProduct = async (product) => {

    console.log(`calculating quantity for product: ${product.name} (${product.id})`)

    const potentialNumbers = []

    for (const article of product.articles) {

        const articleStock = await fetchArticleStock(article.id)

        console.log(' article stock ', articleStock)

        // do not update quantity
        if (articleStock === -1) return -1

        const howMany = articleStock / article.amount

        if (howMany > 0) {
            potentialNumbers.push(howMany)
        } else {
            potentialNumbers.push(0)
        }
    }

    return Math.floor(Math.min(...potentialNumbers))

}


const pushProductToView = async (product) => {

    console.log(`Adding new product to products_view: ${product.name} (${product.id})`)

    const quantity = await calculateQantityForProduct(product)

    const newProduct = new Product({
        id: product.id,
        name: product.name,
        price: product.price,
        // if we fail to get quantity we set it to 0
        quantity: quantity === -1 ? 0 : quantity,
        articles: product.articles.map(({ id, amount }) => ({ id, amount }))
    })

    newProduct.save().then((doc) => { console.log(' Product pushed to product-view') })
        .catch(err => console.error('failed to insert product to product-view'))
}

module.exports = { updateProductView }