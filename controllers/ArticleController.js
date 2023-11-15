// PATH: /controllers/ArticleController.js
const articleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')
const util = require('../utils/util')
const ApiError = require('../utils/api-error')
const { validateId } = require('../utils')
const ArticleController = () => {
  const getArticles = async (req, res, next) => {
    try {
      let page = parseInt(req.query.page) || 1
      const { articles, total } = await articleRepository.getArticles(page)
      const formattedArticles = articles.map(article => {
        return {
          title: util.trimText(article.title, 100),
          description: util.trimText(article.description, 200),
          created_at: article.created_at
        }
      })
      const totalPages = Math.ceil(total / 10)
      const hidePagination = totalPages === 1
      return response(res).success({
        articles: formattedArticles,
        totalItems: total,
        totalPages: totalPages,
        hidePagination: hidePagination
      })
    } catch (err) {
      next(err)
    }
  }
  const getArticlesList = async (req, res, next) => {
    // ... existing code ...
  }
  const getArticleDetails = async (req, res, next) => {
    // ... existing code ...
  }
  return {
    getArticles,
    getArticleDetails,
    getArticlesList
  }
}
module.exports = ArticleController
