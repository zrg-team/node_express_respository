
const rawRepository = require('../repositories/RawRepository')
const response = require('../utils/response')
const { Article } = require('../models/article')
const ApiError = require('../utils/api-error')
const status = require('http-status')

const DashboardController = () => {
  const getArticlesList = async (req, res, next) => {
    try {
      const { status: articleStatus } = req.query
      const limit = 10 // Default limit for pagination
      const page = req.query.page ? parseInt(req.query.page, 10) : 1
      const offset = (page - 1) * limit

      const articles = await Article.findAndCountAll({
        where: { status: articleStatus },
        order: [['published_date', 'DESC']],
        limit,
        offset
      })

      return response(res).success({
        articles: articles.rows,
        totalItems: articles.count,
        totalPages: Math.ceil(articles.count / limit),
        currentPage: page
      })
    } catch (err) {
      next(new ApiError(err.message, status.INTERNAL_SERVER_ERROR))
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
    highlightUser,
    getArticlesList
  }
}

module.exports = DashboardController
