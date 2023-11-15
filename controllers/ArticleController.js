// PATH: /controllers/ArticleController.js
const userRepository = require('../repositories/UserRepository')
const articleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')
const util = require('../utils/util')
const ApiError = require('../utils/api-error')
const { validateId, validatePaginationParams } = require('../utils')
const auth = require('../utils/auth')
const ArticleController = () => {
  const getArticles = async (req, res, next) => {
    try {
      let page = parseInt(req.query.page) || 1
      let limit = parseInt(req.query.limit) || 10
      // Validate pagination parameters
      if (!validatePaginationParams(page, limit)) {
        return next(new ApiError('Wrong format.', 400))
      }
      if (page < 1) {
        return next(new ApiError('Page must be greater than 0.', 400))
      }
      const { articles, total } = await articleRepository.getArticles(page, limit)
      const formattedArticles = articles.map(article => {
        return {
          id: article.id,
          title: util.trimText(article.title, 100),
          description: util.trimText(article.description, 200),
          created_at: article.created_at
        }
      })
      const totalPages = Math.ceil(total / limit)
      return response(res).success({
        status: 200,
        articles: formattedArticles,
        total_pages: totalPages,
        limit: limit,
        page: page
      })
    } catch (err) {
      next(new ApiError('Internal server error.', 500))
    }
  }
  const getArticlesList = async (req, res, next) => {
    // ... existing code ...
  }
  const getArticleDetails = async (req, res, next) => {
    // ... existing code ...
  }
  const readArticle = async (req, res, next) => {
    // ... existing code ...
  }
  const getArticleById = async (req, res, next) => {
    try {
      const { id } = req.params
      if (!validateId(id)) {
        return next(new ApiError('Wrong format.', 422))
      }
      const article = await articleRepository.findById(id)
      if (!article) {
        return next(new ApiError('This article is not found', 404))
      }
      return response(res).success(article)
    } catch (err) {
      return next(err)
    }
  }
  return {
    getArticles,
    getArticleDetails,
    getArticlesList,
    readArticle,
    getArticleById
  }
}
module.exports = ArticleController
