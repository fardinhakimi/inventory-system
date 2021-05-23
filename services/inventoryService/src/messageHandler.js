const { StringCodec } = require('nats')
const { updateInventory } = require('./lib')
const sc = StringCodec()
module.exports = function(nc, sub) {
    (async () => {
        for await (const m of sub) {
            const event = JSON.parse(sc.decode(m.data))
            console.log('Event')
            console.log(event)
            switch(event.type) {
                case 'ARTICLE_SOLD':
                    updateInventory(event, nc)
                    break;
            }
        }
    })()
}