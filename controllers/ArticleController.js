// PATH: /controllers/ArticleController.js
const articleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')
const util = require('../utils/util')
const ApiError = require('../utils/api-error')
const { validateId } = require('../utils')
const ArticleController = () => {
  const getArticlesList = async (req, res, next) => {
    try {
      let page = parseInt(req.query.page)
      let limit = parseInt(req.query.limit)
      // Validate page and limit
      if (isNaN(page) || page < 1) {
        return next(new ApiError('Wrong format. Page must be greater than 0.', 400))
      }
      if (isNaN(limit)) {
        return next(new ApiError('Wrong format.', 400))
      }
      // Fetch articles from the repository
      const { articles, total } = await articleRepository.getArticles(page, limit)
      // Format the articles
      const formattedArticles = articles.map(article => {
        return {
          id: article.id,
          title: util.trimText(article.title, 2),
          description: util.trimText(article.description, 2),
          created_at: article.created_at
        }
      })
      // Calculate total pages
      const totalPages = util.calculateTotalPages(total, limit)
      // Return the response
      return response(res).success({
        articles: formattedArticles,
        totalPages: totalPages,
        limit: limit,
        page: page
      })
    } catch (err) {
      next(err)
    }
  }
  // Existing code...
  const getArticles = async (req, res, next) => {
    // ...
  }
  const getArticleDetails = async (req, res, next) => {
    // ...
  }
  return {
    getArticles,
    getArticleDetails,
    getArticlesList
  }
}
module.exports = ArticleController
