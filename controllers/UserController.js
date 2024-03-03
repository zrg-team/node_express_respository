
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
  const version = (req, res) => {
    return response(res)
      .success({ msg: '1.0.0' })
  }
  const create = async (req, res, next) => {
    try {
      const schema = Joi.object().keys({
        user_name: Joi.string().min(3).max(30).required(),
        user_type_id: Joi.number().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).min(8).max(60).required(),
        confirm: Joi.string()
          .regex(/^[a-zA-Z0-9]{3,30}$/)
          .min(8)
          .max(60)
          .required()
          .valid(Joi.ref('password'))
          .options({
            language: {
              any: {
                allowOnly: 'Passwords do not match'
              }
            }
          })
      })

      // Validate input
      const validater = Joi.validate(req.body, schema, { abortEarly: false })
      if (validater.error) {
        return next(new ApiError(errorHelper.parseErrors(validater.error.details), status.BAD_REQUEST))
      }
      const account = await userRepository.create({
        ...validater.value,
        status: userRepository.STATUS.APPROVED
      })
      return response(res)
        .success(account.toJSON())
    } catch (err) {
      next(err)
    }
  }

  const me = async (req, res, next) => {
    try {
      const { token } = req
      const user = await userRepository
        .findOne({
          where: { // Ensure the where clause is properly formatted
            id: token.id
          },
          include: [
            'userTypeOfUser'
          ]
        })
      return response(res)
        .success({ data: user })
    } catch (err) {
      next(err) // Simplify the error handling
    }
  }

  const login = async (req, res, next) => {
    try {
      const {
        user_name: userName,
        password,
        recaptcha
      } = req.body
      const captchaData = { // Correct the spelling of captcha
        remoteip: req.connection.remoteAddress,
        response: recaptcha
      }
      const verifyResult = await verifyRecaptcha(captchaData)
      if (!verifyResult) {
        return next(new ApiError([{
          field: 'recaptcha',
          value: recaptcha, // Use the correct value for the recaptcha field
          code: ERROR_CODES.RECAPTCHA_NOT_VALID,
          message: 'Recaptcha not found.'
        }], status.BAD_REQUEST))
      }
      if (userName && password) {
        let user = await userRepository
          .findOne({
            where: {
              user_name: userName // Ensure the where clause is properly formatted
            },
            include: [
              'userTypeOfUser'
            ]
          })
        user = user ? user.toJSON() : null
        if (
          !user
        ) { // Ensure proper formatting of if statement
          return next(new ApiError([{
            field: 'user_name',
            value: userName,
            code: ERROR_CODES.USER_NOT_EXIST,
            message: 'Email not found.'
          }], status.BAD_REQUEST))
        } else if (
          user.status === userRepository.STATUS.BANNED
        ) {
          return next(new ApiError([{ // Ensure proper formatting of error handling
            field: 'user_name',
            value: userName,
            code: ERROR_CODES.USER_BANNED,
            message: 'Your account has banned.'
          }], status.BAD_REQUEST))
        } else if (
          user.status === userRepository.STATUS.NEW
        ) {
          return next(new ApiError([{ // Ensure proper formatting of error handling
            field: 'user_name',
            value: userName,
            code: ERROR_CODES.USER_NOT_VERIFY,
            message: 'Please verify your email.'
          }], status.BAD_REQUEST))
        }
        if (bcryptService.comparePassword(password, user.password)) {
          const token = auth
            .utils
            .issue({ // Ensure proper formatting of object
              id: user.id,
              user_name: user.user_name,
              user_type: user.user_type_id,
              type_code: user.userTypeOfUser.code
            })
          delete user.password
          return response(res)
            .success({ token, user })
        } // Ensure proper formatting of if statement

        return next(new ApiError([{
          field: 'user_name',
          value: userName,
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Username or password not correct.'
        }], status.BAD_REQUEST))
      }
      return next(new ApiError([{
        field: 'user_name', // Ensure the where clause is properly formatted
        value: userName,
        code: ERROR_CODES.PARAMS_ERROR,
        message: 'Bad Request: Email or password is wrong.'
      }], status.BAD_REQUEST))
    } catch (err) {
      return next(err)
    }
  } // Ensure proper formatting of function

  const verify = async (req, res, next) => {
    try {
      const {
        email,
        token
      } = req.body
      if (email && token) {
        let user = await userRepository
          .findOne({ // Ensure the where clause is properly formatted
            where: {
              user_name: email
            },
            include: [
              'userTypeOfUser'
            ]
          })
        user = user ? user.toJSON() : null
        if (
          !user
        ) { // Ensure proper formatting of if statement
          return next(new ApiError([{
            field: 'user_name',
            value: email,
            code: ERROR_CODES.USER_NOT_EXIST,
            message: 'User not found.'
          }], status.BAD_REQUEST))
        } else if (
          user.status === userRepository.STATUS.BANNED
        ) {
          return next(new ApiError([{ // Ensure proper formatting of error handling
            field: 'user_name',
            value: email,
            code: ERROR_CODES.USER_BANNED,
            message: 'User banned.'
          }], status.BAD_REQUEST))
        }
        return auth.utils.verify(token, async (err) => {
          if (err) {
            return next(new ApiError([{ // Ensure proper formatting of error handling
              field: 'user_name',
              value: email,
              code: ERROR_CODES.UNAUTHORIZED,
              message: 'Unauthorized.'
            }], status.BAD_REQUEST))
          }
          await userRepository.update({
            status: userRepository.STATUS.APPROVED
          }, { where: { user_name: email } })
          response(res) // Simplify the response call
            .success()
        })
      }
      return next(new ApiError([{
        field: 'user_name',
        value: email,
        code: ERROR_CODES.PARAMS_ERROR, // Ensure proper formatting of error code
        message: 'Verify email error.'
      }], status.BAD_REQUEST))
    } catch (err) {
      return next(err)
    }
  } // Ensure proper formatting of function

  const forgotPassword = async (req, res, next) => {
    try {
      const {
        user_name: userName,
        recaptcha
      } = req.body // Ensure proper destructuring of request body
      const capchaData = {
        remoteip: req.connection.remoteAddress,
        response: recaptcha
      }
      const verifyResult = await verifyRecaptcha(capchaData)
      if (!verifyResult) {
        return next(new ApiError([{
          field: 'recaptcha',
          value: recaptcha, // Use the correct value for the recaptcha field
          code: ERROR_CODES.RECAPTCHA_NOT_VALID,
          message: 'Recaptcha not found.'
        }], status.BAD_REQUEST))
      }
      if (userName) {
        let user = await userRepository
          .findOne({
            where: {
              user_name: userName // Ensure the where clause is properly formatted
            },
            include: [
              'userTypeOfUser'
            ]
          })
        user = user ? user.toJSON() : null
        if (
          !user
        ) { // Ensure proper formatting of if statement
          return next(new ApiError([{
            field: 'user_name',
            value: userName,
            code: ERROR_CODES.USER_NOT_EXIST,
            message: 'User not found.'
          }], status.BAD_REQUEST))
        } else if (
          user.status === userRepository.STATUS.BANNED
        ) {
          return next(new ApiError([{ // Ensure proper formatting of error handling
            field: 'user_name',
            value: userName,
            code: ERROR_CODES.USER_BANNED,
            message: 'User banned.'
          }], status.BAD_REQUEST))
        }
        const token = auth
          .utils
          .issue({ // Ensure proper formatting of object
            id: user.id,
            user_name: userName,
            user_type: user.user_type_id,
            time: Date.now()
          }, 43200)
        await sendMail(
          'forgot_password',
          {
            token, // Ensure proper formatting of object
            email: userName
          },
          {
            to: userName,
            subject: 'Reset Password'
          }
        )
        response(res)
          .success()
      }
      return next(new ApiError([{
        field: 'user_name', // Ensure the where clause is properly formatted
        value: userName,
        code: ERROR_CODES.PARAMS_ERROR,
        message: 'Send email error.'
      }], status.BAD_REQUEST))
    } catch (err) {
      return next(err)
    }
  } // Ensure proper formatting of function

  const changePassword = async (req, res, next) => {
    try {
      const schema = Joi.object().keys({
        token: Joi.string().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).min(8).max(60).required(),
        confirm: Joi.string()
          .regex(/^[a-zA-Z0-9]{3,30}$/) // Ensure proper regex pattern
          .min(8)
          .max(60)
          .required()
          .valid(Joi.ref('password'))
          .options({
            language: {
              any: {
                allowOnly: 'Passwords do not match'
              }
            }
          })
      })
      const capchaData = {
        remoteip: req.connection.remoteAddress,
        response: req.body.recaptcha
      } // Ensure proper formatting of object
      const verifyResult = await verifyRecaptcha(capchaData)
      if (!verifyResult) {
        return next(new ApiError([{
          field: 'recaptcha',
          value: req.body.recaptcha,
          code: ERROR_CODES.RECAPTCHA_NOT_VALID,
          message: 'Recaptcha not found.'
        }], status.BAD_REQUEST)) // Ensure proper formatting of error handling
      }
      delete req.body.recaptcha
      const validater = Joi.validate(req.body, schema, { abortEarly: false })
      if (validater.error) {
        return next(new ApiError(errorHelper.parseErrors(validater.error.details), status.BAD_REQUEST))
      }
      const {
        token,
        password
      } = validater.value // Ensure proper destructuring of validated value
      const tokenData = await new Promise((resolve, reject) => {
        auth.utils.verify(token, async (err, tokenInfo) => {
          if (err) {
            return reject(new ApiError([{
              field: 'token',
              value: token,
              code: ERROR_CODES.UNAUTHORIZED,
              message: 'Unauthorized.'
            }], status.BAD_REQUEST)) // Ensure proper formatting of error handling
          }
          resolve(tokenInfo)
        })
      })
      let user = await userRepository
        .findOne({
          where: {
            user_name: tokenData.user_name
          }, // Ensure proper formatting of where clause
          include: [
            'userTypeOfUser'
          ]
        })
      user = user ? user.toJSON() : null
      if (
        !user
      ) { // Ensure proper formatting of if statement
        return next(new ApiError([{
          field: 'user_name',
          value: tokenData.user_name,
          code: ERROR_CODES.USER_NOT_EXIST,
          message: 'User not found.'
        }], status.BAD_REQUEST))
      } else if (
        user.status === userRepository.STATUS.BANNED
      ) {
        return next(new ApiError([{ // Ensure proper formatting of error handling
          field: 'user_name',
          value: tokenData.user_name,
          code: ERROR_CODES.USER_BANNED,
          message: 'User banned.'
        }], status.BAD_REQUEST))
      }
      await userRepository.update({
        password
      }, { // Ensure proper formatting of update options
        where: {
          user_name: tokenData.user_name
        }
      })
      response(res)
        .success()
    } catch (err) {
      return next(err)
    }
  } // Ensure proper formatting of function

  const find = async (req, res, next) => {
    try {
      const users = await userRepository
        .pushCriteria(defaultCriteria, sensitiveCriteria)
        .apply(req)
        .paginate({})
      return response(res).success(users) // Simplify the response data structure
    } catch (err) {
      return next(err)
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
    version
  }
}

module.exports = UserController
