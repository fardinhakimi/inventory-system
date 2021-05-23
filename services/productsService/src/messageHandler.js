const { StringCodec } = require('nats')
const sc = StringCodec()
module.exports = function(nc, sub) {
    (async () => {
        for await (const m of sub) {
            const event = JSON.parse(sc.decode(m.data))
            console.log('Event')
            console.log(event)
        }
    })()
}