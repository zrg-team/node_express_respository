const rawRepository = require('../repositories/RawRepository')
const response = require('../utils/response')
const Joi = require('@hapi/joi')
const ApiError = require('../utils/api-error')
const { Article } = require('../models/article')
const UserRepository = require('../repositories/UserRepository')

const DashboardController = () => {
  const retrieveUserArticles = async (req, res, next) => {
    try {
      const { userId } = req.params
      const schema = Joi.number().required()

      const { error } = schema.validate(userId)
      if (error) {
        throw new ApiError("Wrong format.", 400)
      }

      const user = await UserRepository.findById(userId)
      if (!user) {
        throw new ApiError("User not found.", 404)
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

  return {
    version,
    highlightUser
  }
    retrieveUserArticles,
}

module.exports = DashboardController
