const Joi = require('@hapi/joi')
const { Op } = require('sequelize')
const status = require('http-status')
const { process } = require('../utils/transaction')
const auth = require('../libs/auth')
const { sendMail } = require('../libs/email')
const verifyRecaptcha = require('../libs/recaptcha')
const errorHelper = require('../utils/errors')
const bcryptService = require('../utils/bcrypt')
const ApiError = require('../utils/api-error')
const response = require('../utils/response')
const { Article } = require('../models/article')
const userRepository = require('../repositories/UserRepository')
const DefaultCriteria = require('../criterias/DefaultCriteria')
const SensitiveCriteria = require('../criterias/SensitiveCriteria')

const ERROR_CODES = {
  USER_NOT_EXIST: 'USER_NOT_EXIST',
  RECAPTCHA_NOT_VALID: 'RECAPTCHA_NOT_VALID',
  USER_BANNED: 'USER_BANNED',
  ARTICLE_CREATION_FAILED: 'ARTICLE_CREATION_FAILED',
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

  // ... other existing functions

  const createArticle = async (req, res, next) => {
    try {
      const { title, content, user_id } = req.body

      if (!title || title.length > 200) {
        throw new ApiError("The title is required and cannot be more than 200 characters.", status.BAD_REQUEST)
      }

      if (!content) {
        throw new ApiError("The content is required.", status.BAD_REQUEST)
      }

      const userExists = await userRepository.findOne({ where: { id: user_id } })
      if (!userExists) {
        throw new ApiError("User not found.", status.NOT_FOUND)
      }

      const articleData = {
        title,
        content,
        userId: user_id,
        status: 'draft',
        description: '', // Assuming description is optional and can be empty
      }

      const newArticle = await process(async (transaction) => {
        return await Article.create(articleData, { transaction })
      })

      return response(res).success({
        status: status.CREATED,
        article: {
          ...newArticle.toJSON(),
          created_at: newArticle.createdAt
        }
      })
    } catch (err) {
      return response(res).error(err instanceof ApiError ? err : new ApiError(err.message, status.INTERNAL_SERVER_ERROR))
    }
  }

  const removeArticle = async (req, res, next) => {
    try {
      const { id } = req.params
      if (isNaN(id)) {
        return response(res).error(new ApiError('Wrong format.', status.BAD_REQUEST))
      }

      const article = await userRepository.findById(id)
      if (!article) {
        return response(res).error(new ApiError('Article not found.', status.NOT_FOUND))
      }

      await userRepository.update(
        { status: 'removed', updated_at: new Date() },
        { where: { id: { [Op.eq]: id } } }
      )

      return response(res).success({
        status: 200,
        message: 'Article removed successfully.'
      })
    } catch (err) {
      return response(res).error(err)
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
    createArticle,
    version,
    removeArticle // Added the removeArticle function from the new code
  }
}

module.exports = UserController
