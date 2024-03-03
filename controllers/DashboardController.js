
const rawRepository = require('../repositories/RawRepository')
const articleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')

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
  
  const getArticlesList = async (req, res, next) => {
    try {
      const { page, limit, category } = req.query
      let queryOptions = {
        page: page || 1,
        limit: limit || 10
      }
      if (category) {
        queryOptions.where = { category }
      }
      const articles = await articleRepository.paginate(queryOptions)
      return response(res)
        .success({
          data: articles.rows,
          total: articles.count,
          totalPages: Math.ceil(articles.count / queryOptions.limit)
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
