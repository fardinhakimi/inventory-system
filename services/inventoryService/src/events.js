const { updateOne } = require('./inventory')

const PRODUCT_SOLD = 'ProductSold'
const INVENTORY_UPDATED = 'INVENTORY_UPDATED'
const handleEvent = (event) => {

    switch(event.type){
        case PRODUCT_SOLD:
            updateInventory(event.payload)
    }
}

const emitInventoryUpdated = ({ id }) => {
    // EMIT NEW EVENT 
    // { type: INVENTORY_UPDATED, payload }: { type: string, payload: { id: string }}
}


function updateInventory(articles) {
    articles.map( async ( item ) => {

        try {

            await updateOne(item)
            emitInventoryUpdated(item)

        } catch (error) {
            console.log(`Failed to update article with id of ${item.id}`)
        }
    })
}