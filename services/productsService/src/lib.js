const fetch = require('node-fetch')

const updateProductsView = (product) => {
    fetch('http://query-service:3000/update_products_view', {
        method: 'POST',
        body: JSON.stringify({
            type: 'PRODUCT_CREATED',
            payload: product
        }),
        headers: { 'Content-Type': 'application/json' }
    }).catch(err => {
        console.error(err)
        console.error('Failed to update products view')
    })
}

const updateInventory = (product) => {

    if (!product.articles) return

    for (article of product.articles) {
        fetch('http://inventory-service:3000/update_inventory', {
            method: 'POST',
            body: JSON.stringify({ type: 'ARTICLE_SOLD', payload: article }),
            headers: { 'Content-Type': 'application/json' }
        }).then((result) => {
            console.log('inventory updated')
        }).catch(err => {
            console.error(err)
            console.error('Failed to update inventory')
        })
    }
}


module.exports = {
    updateInventory,
    updateProductsView
}