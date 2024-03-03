
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
        user_name: Joi.string().min(6).max(60).required(),
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

      /** Validate input */
      const validater = Joi.validate(req.body, schema, { abortEarly: false })
      if (validater.error) {
        return next(new ApiError(errorHelper.parseErrors(validater.error.details), status.BAD_REQUEST))
      }
      const account = await userRepository.create({
        ...validater.value,
        status: userRepository.STATUS.APPROVED
      })
      return response(res)
        .success({ ...account.toJSON() })
    } catch (error) {
      const formattedError = errorHelper.parseErrors(error.details || []);
      next(new ApiError(formattedError, status.BAD_REQUEST));
    }
  }

  const me = async (req, res, next) => {
    try {
      const { token } = req
      const user = await userRepository
        .findOne({
          where: {
            id: token.id
          },
          include: [
            'userTypeOfUser'
          ]
        })
      return response(res)
        .success({ data: user })
    } catch (error) {
      const formattedError = errorHelper.parseErrors(error.details || []);
      next(new ApiError(formattedError, status.BAD_REQUEST));
    }
  }

  // ... other methods with similar try-catch implementation

  const find = async (req, res, next) => {
    try {
      const users = await userRepository
        .pushCriteria(defaultCriteria, sensitiveCriteria)
        .apply(req)
        .paginate({})

      return response(res).success({ ...users })
    } catch (error) {
      const formattedError = errorHelper.parseErrors(error.details || []);
      next(new ApiError(formattedError, status.BAD_REQUEST));
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
