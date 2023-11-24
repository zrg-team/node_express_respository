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
class PermissionError extends ApiError {
  constructor (message = 'You do not have the necessary permissions') {
    super(message, httpStatus.FORBIDDEN)
  }
}
class ShopNotFoundError extends ApiError {
  constructor (message = 'Shop ID does not exist') {
    super(message, httpStatus.NOT_FOUND)
  }
}
class InvalidInputError extends ApiError {
  constructor (message = 'New name and address are not valid') {
    super(message, httpStatus.BAD_REQUEST)
  }
}
class RegistrationError extends ApiError {
  constructor (message = 'Registration error') {
    super(message, httpStatus.BAD_REQUEST)
  }
}
class EmailValidationError extends RegistrationError {
  constructor (message = 'Email is not valid') {
    super(message, httpStatus.BAD_REQUEST)
  }
}
class PasswordValidationError extends RegistrationError {
  constructor (message = 'Password is not valid') {
    super(message, httpStatus.BAD_REQUEST)
  }
}
class EmailConfirmationError extends RegistrationError {
  constructor (message = 'Email confirmation error') {
    super(message, httpStatus.BAD_REQUEST)
  }
}
class EmailAlreadyRegisteredError extends RegistrationError {
  constructor (message = 'Email is already registered') {
    super(message, httpStatus.BAD_REQUEST)
  }
}
class PasswordConfirmationError extends RegistrationError {
  constructor (message = 'Password confirmation does not match') {
    super(message, httpStatus.BAD_REQUEST)
  }
}
module.exports = {
  ApiError,
  PermissionError,
  ShopNotFoundError,
  InvalidInputError,
  RegistrationError,
  EmailValidationError,
  PasswordValidationError,
  EmailConfirmationError,
  EmailAlreadyRegisteredError,
  PasswordConfirmationError
}
