const { validationResult } = require('express-validator')
const { CustomError } = require('../error/index')

const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array())
  }
  next()
}

function errorHandler(err, req, res, next) {
  if (err instanceof CustomError) {
    return res.status(err.getStatusCode()).send({ errors: err.serializeErrors() })
  }
  return res.status(400).send({ errors: { message: 'something went wrong'}})
}

module.exports = {
  validateRequest,
  errorHandler
}