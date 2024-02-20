
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

  static titleLengthError() {
    return new ApiError("You cannot input more than 200 characters.", httpStatus.BAD_REQUEST);
  }

  static dateFormatError() {
    return new ApiError("Wrong date format.", httpStatus.UNPROCESSABLE_ENTITY);
  }

  static pageNumberError() {
    return new ApiError("Page must be greater than 0.", httpStatus.BAD_REQUEST);
  }

  static parameterTypeError() {
    return new ApiError("Wrong format.", httpStatus.BAD_REQUEST);
  }
}

module.exports = ApiError
