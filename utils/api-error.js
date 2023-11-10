const httpStatus = require('http-status')
class ExtendableError extends Error {
  constructor (message, status) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.status = status
    Error.captureStackTrace(this, this.constructor.name)
  }
}
class ApiError extends ExtendableError {
  /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     */
  constructor (message, status = httpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status)
  }
}
class InvalidIdError extends ApiError {
  constructor() {
    super('Invalid user ID.', httpStatus.BAD_REQUEST)
  }
}
class UserNotFoundError extends ApiError {
  constructor() {
    super('User not found.', httpStatus.NOT_FOUND)
  }
}
class EmailAlreadyRegisteredError extends ApiError {
  constructor() {
    super('Email is already registered.', httpStatus.BAD_REQUEST)
  }
}
module.exports = { ApiError, InvalidIdError, UserNotFoundError, EmailAlreadyRegisteredError }
