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
  static notFound(message = 'Not found') {
    return new ApiError(message, httpStatus.NOT_FOUND)
  }
  static badRequest(message = 'Bad request') {
    return new ApiError(message, httpStatus.BAD_REQUEST)
  }
}
module.exports = ApiError
