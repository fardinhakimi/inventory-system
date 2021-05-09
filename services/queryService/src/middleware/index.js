const { CustomError } = require('../error')
function errorHandler(err, req, res, next) {
  if (err instanceof CustomError) {
    return res.status(err.getStatusCode()).send({ errors: err.serializeErrors() })
  }
  return res.status(400).send({ errors: { message: 'something went wrong'}})
}


module.exports = { errorHandler }