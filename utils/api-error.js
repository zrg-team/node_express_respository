const httpStatus = require('http-status')
const User = require('../models/User')
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
  constructor (message, status = httpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status)
  }
}
class PermissionError extends ApiError {
  constructor (message = 'Permission denied') {
    super(message, httpStatus.FORBIDDEN)
  }
}
class ShopNotFoundError extends ApiError {
  constructor (message = 'Shop not found') {
    super(message, httpStatus.NOT_FOUND)
  }
}
class InvalidInputError extends ApiError {
  constructor (message = 'Invalid input') {
    super(message, httpStatus.BAD_REQUEST)
  }
}
class RegistrationError extends ApiError {
  constructor (message = 'Registration error') {
    super(message, httpStatus.BAD_REQUEST)
  }
}
class EmailValidationError extends ApiError {
  constructor (message = 'Invalid email') {
    super(message, httpStatus.BAD_REQUEST)
  }
}
class PasswordValidationError extends ApiError {
  constructor (message = 'Invalid password') {
    super(message, httpStatus.BAD_REQUEST)
  }
}
class EmailConfirmationError extends ApiError {
  constructor (message = 'Email confirmation error') {
    super(message, httpStatus.BAD_REQUEST)
  }
}
class EmailAlreadyRegisteredError extends ApiError {
  constructor (message = 'Email already registered') {
    super(message, httpStatus.CONFLICT)
  }
}
class PasswordConfirmationError extends ApiError {
  constructor (message = 'Password confirmation error') {
    super(message, httpStatus.BAD_REQUEST)
  }
}
async function validateEmail(email) {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  if (!emailRegex.test(email)) {
    throw new EmailValidationError()
  }
  const user = await User.findOne({ email })
  if (user) {
    throw new EmailAlreadyRegisteredError()
  }
}
function validatePassword(password, passwordConfirmation) {
  if (password.length < 8) {
    throw new PasswordValidationError()
  }
  if (password !== passwordConfirmation) {
    throw new PasswordConfirmationError()
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
  PasswordConfirmationError,
  validateEmail,
  validatePassword
}
