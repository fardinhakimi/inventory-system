class CustomError extends Error {
    statusCode
    constructor(statusCode) {
      super()
      this.statusCode = statusCode
      Object.setPrototypeOf(this, CustomError.prototype)
    }
    getStatusCode() {
      return this.statusCode
    }
}

class ValidationError extends CustomError {
    error;
    constructor(errors) {
      super(400)
      this.errors = errors
      Object.setPrototypeOf(this, ValidationError.prototype)
    }
    serializeErrors() {
      return this.errors.map( ( { msg, param}) => {
        return { message: msg, field: param}
      })
    }
}
  
class DatbaseConnectionError extends CustomError {
    error = 'Failed to connect to the database'
    constructor() {
      super(500)
      Object.setPrototypeOf(this, DatbaseConnectionError.prototype)
    }
    serializeErrors() {
      return [ { message: this.error }]
    }
}

module.exports = {
  CustomError,
  ValidationError,
  DatbaseConnectionError
}