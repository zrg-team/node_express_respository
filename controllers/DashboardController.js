const rawRepository = require('../repositories/RawRepository')
const response = require('../utils/response')
const Joi = require('@hapi/joi')
const ApiError = require('../utils/api-error')
const { Article } = require('../models/article')
const UserRepository = require('../repositories/UserRepository')
const httpStatus = require('http-status')

const DashboardController = () => {
  const version = (req, res) => {
    return response(res)
      .success({ msg: '1.0.0' })
  }

  const highlightUser = async (req, res, next) => {
    try {
      const { 0: data } = await rawRepository.select(`
      SELECT
        *
      FROM
        USER
      LIMIT 1;
      `)

      return response(res)
        .success({
          ...data
        })
    } catch (err) {
      next(err)
    }
  }

  const editArticle = async (req, res, next) => {
    try {
      const { id, title, content } = req.body

      if (isNaN(id)) {
        return response(res).error(new ApiError('Wrong format.', httpStatus.UNPROCESSABLE_ENTITY))
      }

      if (!title || title.length > 200) {
        return response(res).error(new ApiError('You cannot input more than 200 characters.', httpStatus.BAD_REQUEST))
      }

      if (!content) {
        return response(res).error(new ApiError('The content is required.', httpStatus.BAD_REQUEST))
      }

      const article = await Article.findByPk(id)

      if (!article) {
        return response(res).error(new ApiError('Article not found.', httpStatus.NOT_FOUND))
      }

      await Article.update({ title, content, updated_at: new Date() }, { where: { id } })

      return response(res).success({
        message: 'The article was successfully updated.',
        article: {
          id,
          title,
          content,
          updated_at: new Date().toISOString()
        }
      })
    } catch (err) {
      next(err)
    }
  }

  const updateArticleStatus = async (req, res, next) => {
    try {
      const { id, status } = req.body
      const allowedStatuses = ['draft', 'submitted', 'approved', 'removed']

      if (!allowedStatuses.includes(status)) {
        throw new ApiError('Invalid status value.', httpStatus.UNPROCESSABLE_ENTITY)
      }

      const article = await Article.findByPk(id)
      if (!article) {
        throw new ApiError('Article not found.', httpStatus.NOT_FOUND)
      }

      await article.update({ status, updated_at: new Date() })

      return response(res)
        .success({
          status: httpStatus.OK,
          article: {
            id: article.id,
            status: article.status,
            updated_at: article.updated_at
          }
        })
    } catch (err) {
      if (err instanceof ApiError) {
        return response(res).error(err)
      }
      next(err)
    }
  }

  const retrieveUserArticles = async (req, res, next) => {
    try {
      const { userId } = req.params
      const schema = Joi.number().required()

      const { error } = schema.validate(userId)
      if (error) {
        throw new ApiError("Wrong format.", httpStatus.BAD_REQUEST)
      }

      const user = await UserRepository.findById(userId)
      if (!user) {
        throw new ApiError("User not found.", httpStatus.NOT_FOUND)
      }

      const articles = await Article.findAll({
        where: { userId: user.id },
        attributes: ['id', 'title', 'description', 'content', 'status', 'created_at', 'updated_at']
      })

      const responseBody = {
        articles: articles,
        total_items: articles.length,
        total_pages: 1 // Assuming no pagination for simplicity
      }

      return response(res).success(responseBody)
    } catch (err) {
      if (err instanceof ApiError) {
        return response(res).error(err)
      }
      next(err)
    }
  }

  return {
    version,
    highlightUser,
    editArticle,
    updateArticleStatus,
    retrieveUserArticles,
  }
}

module.exports = DashboardController
