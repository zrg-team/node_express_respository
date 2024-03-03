
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
const articleRepository = require('../repositories/ArticleRepository') // Added line
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
    // ... existing create function code
  }

  const me = async (req, res, next) => {
    // ... existing me function code
  }

  const login = async (req, res, next) => {
    // ... existing login function code
  }

  const verify = async (req, res, next) => {
    // ... existing verify function code
  }

  const forgotPassword = async (req, res, next) => {
    // ... existing forgotPassword function code
  }

  const changePassword = async (req, res, next) => {
    // ... existing changePassword function code
  }

  const find = async (req, res, next) => {
    // ... existing find function code
  }

  const postComment = async (req, res, next) => {
    try {
      const schema = Joi.object({
        article_id: Joi.number().required(),
        user_id: Joi.number().required(),
        content: Joi.string().required()
      })

      const { error, value } = schema.validate(req.body)

      if (error) {
        throw new ApiError(error.details[0].message, status.BAD_REQUEST)
      }

      const { article_id, user_id, content } = value

      const article = await articleRepository.findById(article_id)
      if (!article) {
        throw new ApiError('Article not found', status.NOT_FOUND)
      }

      const user = await userRepository.findById(user_id)
      if (!user) {
        throw new ApiError('User not found', status.NOT_FOUND)
      }

      const comment = await commentRepository.create({
        article_id,
        user_id,
        content,
        created_at: new Date()
      })

      return response(res).success({
        id: comment.id,
        article_id: comment.article_id,
        user_id: comment.user_id,
        content: comment.content,
        created_at: comment.created_at
      })
    } catch (err) {
      next(err)
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
    postComment // Added line
  }
}

module.exports = UserController
