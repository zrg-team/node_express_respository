const Joi = require('@hapi/joi')
const status = require('http-status')
const { Article, ArticleTag, Tag } = require('../models')
const BaseRepository = require('../repositories/BaseRepository')
const auth = require('../libs/auth')
const { sendMail } = require('../libs/email')
const verifyRecaptcha = require('../libs/recaptcha')
const errorHelper = require('../utils/errors')
const bcryptService = require('../utils/bcrypt')
const ApiError = require('../utils/api-error')
const response = require('../utils/response')
const userRepository = require('../repositories/UserRepository')
const articleRepository = require('../repositories/ArticleRepository')
const commentRepository = require('../repositories/CommentRepository')
const DefaultCriteria = require('../criterias/DefaultCriteria')
const SensitiveCriteria = require('../criterias/SensitiveCriteria')

const ERROR_CODES = {
  USER_NOT_EXIST: 'USER_NOT_EXIST',
  RECAPTCHA_NOT_VALID: 'RECAPTCHA_NOT_VALID',
  USER_BANNED: 'USER_BANNED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  PARAMS_ERROR: 'PARAMS_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
  USER_NOT_VERIFY: 'USER_NOT_VERIFY',
  ARTICLE_NOT_FOUND: 'ARTICLE_NOT_FOUND',
  TAG_NOT_FOUND: 'TAG_NOT_FOUND'
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
    // ... existing postComment function code
  }

  const assignArticleToCategory = async (req, res, next) => {
    // ... existing assignArticleToCategory function code
  }

  const tagArticle = async (req, res, next) => {
    try {
      const schema = Joi.object({
        article_id: Joi.number().integer().required(),
        tag_id: Joi.number().integer().required()
      })

      const { error, value } = schema.validate(req.body)

      if (error) {
        throw new ApiError(error.details[0].message, status.BAD_REQUEST)
      }

      const { article_id, tag_id } = value

      const article = await Article.findByPk(article_id)
      if (!article) {
        throw new ApiError('Article not found.', status.NOT_FOUND)
      }

      const tag = await Tag.findByPk(tag_id)
      if (!tag) {
        throw new ApiError('Tag not found.', status.NOT_FOUND)
      }

      await ArticleTag.create({ article_id, tag_id })

      return response(res).success({ message: 'Article tagged successfully.' })
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
    version,
    postComment,
    assignArticleToCategory,
    tagArticle
  }
}

module.exports = UserController
