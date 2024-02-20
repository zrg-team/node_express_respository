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
     * @param {boolean} [isPublic=false] - Whether the message should be visible to the client.
     * @param {boolean} [isOperational=true] - Indicates if the error is operational.
     */
  constructor (message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false, isOperational = true) {
    super(message, status)
    this.name = this.constructor.name
    this.message = message || 'An unexpected error occurred.'
    this.status = status
    this.isPublic = isPublic
    this.isOperational = isOperational
  }

  static titleLengthError() {
    return new ApiError("You cannot input more than 200 characters.", httpStatus.BAD_REQUEST, true);
  }

  static dateFormatError() {
    return new ApiError("Wrong date format.", httpStatus.UNPROCESSABLE_ENTITY, true);
  }

  static pageNumberError() {
    return new ApiError("Page must be greater than 0.", httpStatus.BAD_REQUEST, true);
  }

  static parameterTypeError() {
    return new ApiError("Wrong format.", httpStatus.BAD_REQUEST, true);
  }

  static articleNotFound() {
    return new ApiError('This article is not found.', httpStatus.NOT_FOUND, true);
  }

  static wrongFormat() {
    return new ApiError('Wrong format.', httpStatus.UNPROCESSABLE_ENTITY, true);
  }

  static titleTooLong() {
    return new ApiError('You cannot input more than 100 characters.', httpStatus.BAD_REQUEST, true);
  }

  static titleRequired() {
    return new ApiError('The title is required.', httpStatus.BAD_REQUEST, true);
  }

  static contentTooLong() {
    return new ApiError('You cannot input more than 10000 characters.', httpStatus.BAD_REQUEST, true);
  }
}

module.exports = ApiError
