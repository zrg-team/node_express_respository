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

class ArticleNotFoundError extends ApiError {
  constructor(message = 'Article not found') {
    super(message, httpStatus.NOT_FOUND)
  }
}

class UserNotFoundError extends ApiError {
  constructor(message = 'User not found') {
    super(message, httpStatus.NOT_FOUND)
  }
}

class ContentRequiredError extends ApiError {
  constructor(message = 'The content is required') {
    super(message, httpStatus.BAD_REQUEST)
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

module.exports = ApiError

module.exports = {
  ApiError, ArticleNotFoundError, UserNotFoundError, ContentRequiredError
}