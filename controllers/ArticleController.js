// PATH: /controllers/ArticleController.js
const ArticleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')
const { validatePage } = require('../utils/validate')
const validateId = require('../utils/validateId')
const ApiError = require('../utils/api-error')
const ArticleController = () => {
  const getArticles = async (req, res, next) => {
    try {
      const page = validatePage(req.query.page)
      const { articles, total } = await ArticleRepository.getArticles(page)
      const formattedArticles = articles.map(article => {
        let { title, description, created_at } = article
        title = title.length > 100 ? `${title.substring(0, 100)}...` : title
        description = description.length > 100 ? `${description.substring(0, 100)}...` : description
        return { title, description, created_at }
      })
      return response(res)
        .success({
          articles: formattedArticles,
          total,
          pages: Math.ceil(total / 10)
        })
    } catch (err) {
      next(err)
    }
  }
  const getArticleDetails = async (req, res, next) => {
    try {
      const { id } = req.params
      // Validate id
      if (!validateId(id)) {
        return next(new ApiError('Invalid ID', 400))
      }
      // Fetch article details
      const article = await ArticleRepository.getArticleById(id)
      // Check if article exists
      if (!article) {
        return next(new ApiError('Article not found', 404))
      }
      // Extract required fields
      const { title, description, created_at } = article
      // Return article details
      return response(res).success({ title, description, created_at })
    } catch (err) {
      return next(err)
    }
  }
  return {
    getArticles,
    getArticleDetails
  }
}
module.exports = ArticleController
