
const httpStatus = require('http-status')

class ApiError extends Error {
  /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     */
  constructor (message, status = httpStatus.INTERNAL_SERVER_ERROR) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ApiError
