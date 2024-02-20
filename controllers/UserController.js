
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
const articleRepository = require('../repositories/ArticleRepository') // Assuming similar structure for ArticleRepository
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
  // ... (rest of the existing code)

  const updateArticle = async (req, res, next) => {
    try {
      const articleId = req.params.id
      const { title, content } = req.body

      const schema = Joi.object({
        id: Joi.number().required(),
        title: Joi.string().max(100).required(),
        content: Joi.string().max(10000).required()
      })

      const { error } = schema.validate({ id: articleId, title, content })
      if (error) {
        throw new ApiError(error.details[0].message, status.BAD_REQUEST)
      }

      const article = await articleRepository.findById(articleId)
      if (!article) {
        throw new ApiError('This article is not found.', status.NOT_FOUND)
      }

      if (req.token.id !== article.user_id && !auth.utils.validateToken('ADMIN', req.token)) {
        throw new ApiError('You do not have permission to update this article.', status.FORBIDDEN)
      }

      const updatedArticle = await articleRepository.update({ title, content }, { where: { id: articleId } })

      return response(res).success({ article: updatedArticle })
    } catch (err) {
      if (err instanceof ApiError) {
        return response(res).error(err)
      }
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
    updateArticle // Added the new updateArticle function
  }
}

module.exports = UserController
