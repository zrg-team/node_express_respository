
const rawRepository = require('../repositories/RawRepository')
const response = require('../utils/response')
const ApiError = require('../utils/api-error')
const DefaultCriteria = require('../criterias/DefaultCriteria')
const ArticleRepository = require('../repositories/ArticleRepository')
const httpStatus = require('http-status')

const validateParameters = (title, date, page, limit) => {
  if (title && title.length > 200) {
    throw new ApiError('You cannot input more than 200 characters.', httpStatus.BAD_REQUEST)
  }
  if (date && isNaN(Date.parse(date))) {
    throw new ApiError('Wrong date format.', httpStatus.BAD_REQUEST)
  }
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    throw new ApiError('Page must be greater than 0.', httpStatus.BAD_REQUEST)
  }
  if (limit && isNaN(limit)) {
    throw new ApiError('Wrong format.', httpStatus.BAD_REQUEST)
  }
}

const DashboardController = () => {
  const filterSearchArticles = async (req, res, next) => {
    try {
      const { title, date, page, limit } = req.query

      validateParameters(title, date, page, limit)

      const defaultCriteria = new DefaultCriteria()
      const articleRepository = new ArticleRepository()

      const criteria = defaultCriteria.filter(req, articleRepository.model, articleRepository)
      const articlesData = await articleRepository.pushCriteria(criteria).paginate({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
      })

      return response(res).success({
        articles: articlesData.rows,
        total_pages: articlesData.pages,
        limit: articlesData.limit,
        page: articlesData.page
      })
    } catch (err) {
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
    highlightUser,
    filterSearchArticles
  }
}

module.exports = DashboardController
