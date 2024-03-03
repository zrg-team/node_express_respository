
const httpStatus = require('http-status')
const { i18n } = require('../config/index')

class ExtendableError extends Error {
  constructor (message, status, isPublic) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.status = status
    this.isPublic = isPublic
    Error.captureStackTrace(this, this.constructor.name)
  }
}

class ApiError extends ExtendableError {
  /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     * @param {boolean} isPublic - Whether the message should be visible to the client or not.
     */
  constructor (message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
    super(message, status, isPublic)
    this.name = this.constructor.name
    this.message = i18n.__(message)
    this.status = status
    Error.captureStackTrace(this, this.constructor.name)
  }
}

module.exports = ApiError
