// PATH: /controllers/ArticleController.js
const ApiError = require('../utils/api-error')
const response = require('../utils/response')
const validateId = require('../utils/validateId')
const articleRepository = require('../repositories/ArticleRepository')
const ArticleController = () => {
  const getArticleDetails = async (req, res, next) => {
    try {
      const { id } = req.params
      // Validate id
      if (!validateId(id)) {
        return next(new ApiError('Invalid ID', 400))
      }
      // Fetch article details
      const article = await articleRepository.getArticleById(id)
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
    getArticleDetails,
    // other controller methods...
  }
}
module.exports = ArticleController
