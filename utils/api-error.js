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
// Other error classes...
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
