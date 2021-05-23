const { StringCodec } = require('nats')
const { pushProductToView, updateQuantityForProducts} = require('./lib')
const sc = StringCodec()
module.exports = function(nc, sub) {
    (async () => {
        for await (const m of sub) {
            const event = JSON.parse(sc.decode(m.data))
            console.log('Event')
            console.log(event)
            switch (event.type) {
                case 'PRODUCT_CREATED':
                    pushProductToView(event.payload)
                    break;
                case 'INVENTORY_UPDATED':
                    updateQuantityForProducts(event.payload.id)
                    break
            }
        }
    })()
}