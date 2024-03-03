
const rawRepository = require('../repositories/RawRepository')
const response = require('../utils/response')
const DefaultCriteria = require('../criterias/DefaultCriteria')
const DetailCriteria = require('../criterias/DetailCriteria')
const ArticleRepository = require('../repositories/ArticleRepository')

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
      const defaultCriteria = new DefaultCriteria()
      const detailCriteria = new DetailCriteria()
      const filters = defaultCriteria.filter(req)
      const details = detailCriteria.filter(req)

      const articles = await ArticleRepository
        .pushCriteria(defaultCriteria, detailCriteria)
        .apply(req)
        .paginate(filters, details)

      return response(res)
        .success({
          articles: articles.data,
          total_items: articles.total,
          total_pages: articles.lastPage
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
