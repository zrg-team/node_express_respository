// PATH: /controllers/DashboardController.js
const rawRepository = require('../repositories/RawRepository')
const response = require('../utils/response')
const repositoryHelper = require('../utils/repositoryHelper')
const util = require('../utils/util')
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
  const getArticles = async (req, res, next) => {
    try {
      const page = req.query.page || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const articles = await rawRepository.select(`
        SELECT
          title,
          description,
          created_at
        FROM
          articles
        ORDER BY
          created_at DESC
        LIMIT ${limit} OFFSET ${offset};
      `)
      const totalItems = await rawRepository.count('articles');
      const totalPages = Math.ceil(totalItems / limit);
      const hidePagination = totalPages === 1;
      const trimmedArticles = articles.map(article => ({
        ...article,
        title: util.trimString(article.title, 2),
        description: util.trimString(article.description, 2),
      }));
      return response(res)
        .success({
          articles: trimmedArticles,
          totalItems,
          totalPages,
          hidePagination,
        })
    } catch (err) {
      next(err)
    }
  }
  return {
    version,
    highlightUser,
    getArticles
  }
}
module.exports = DashboardController
