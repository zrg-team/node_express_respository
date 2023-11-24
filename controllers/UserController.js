// PATH: /controllers/UserController.js
const Joi = require('@hapi/joi')
const status = require('http-status')
const auth = require('../libs/auth')
const { sendMail } = require('../libs/email')
const verifyRecaptcha = require('../libs/recaptcha')
const errorHelper = require('../utils/errors')
const bcryptService = require('../utils/bcrypt')
const ApiError = require('../utils/api-error')
const response = require('../utils/response')
const userRepository = require('../repositories/UserRepository')
const DefaultCriteria = require('../criterias/DefaultCriteria')
const SensitiveCriteria = require('../criterias/SensitiveCriteria')
const ERROR_CODES = {
  USER_NOT_EXIST: 'USER_NOT_EXIST',
  RECAPTCHA_NOT_VALID: 'RECAPTCHA_NOT_VALID',
  USER_BANNED: 'USER_BANNED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  PARAMS_ERROR: 'PARAMS_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
  USER_NOT_VERIFY: 'USER_NOT_VERIFY'
}
const defaultCriteria = new DefaultCriteria()
const sensitiveCriteria = new SensitiveCriteria()
const UserController = () => {
  // ... other functions
  const registerUser = async (req, res, next) => {
    try {
      const { email, password, password_confirmation } = req.body;
      // Validate email
      const emailError = errorHelper.validateEmail(email);
      if (emailError) {
        return next(new ApiError(emailError, status.BAD_REQUEST));
      }
      // Check if email already exists
      const existingUser = await userRepository.checkEmailExists(email);
      if (existingUser) {
        return next(new ApiError('Email already registered', status.BAD_REQUEST));
      }
      // Validate password
      const passwordError = errorHelper.validatePassword(password, password_confirmation);
      if (passwordError) {
        return next(new ApiError(passwordError, status.BAD_REQUEST));
      }
      // Encrypt password
      const encryptedPassword = bcryptService.encryptPassword(password);
      // Create user
      const user = await userRepository.createUser({ email, password: encryptedPassword });
      // Send confirmation email
      await sendMail(user.email, 'Confirmation Email', 'Please confirm your email');
      // Return success response
      return response(res).success({ id: user.id, email: user.email, confirmed: user.confirmed });
    } catch (err) {
      next(err);
    }
  }
  return {
    me,
    verify,
    create,
    login,
    find,
    changePassword,
    forgotPassword,
    version,
    registerUser  // Add the new function here
  }
}
module.exports = UserController
