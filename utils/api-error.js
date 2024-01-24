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

// Custom error codes for article creation process
const USER_NOT_FOUND = new ApiError('User not found.', httpStatus.NOT_FOUND);
const INVALID_INPUT = new ApiError('Invalid input.', httpStatus.BAD_REQUEST);
const ARTICLE_CREATION_FAILED = new ApiError('Article creation failed.', httpStatus.UNPROCESSABLE_ENTITY);

module.exports = { ApiError, USER_NOT_FOUND, INVALID_INPUT, ARTICLE_CREATION_FAILED }
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     */
  constructor (message, status = httpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status)
  }
}

module.exports = ApiError
