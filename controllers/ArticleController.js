// PATH: /controllers/ArticleController.js
const userRepository = require('../repositories/UserRepository')
const articleRepository = require('../repositories/ArticleRepository')
const ApiError = require('../utils/api-error')
const response = require('../utils/response')
const db = require('../libs/db')
const ArticleController = () => {
  // Other functions...
  const readArticle = async (req, res, next) => {
    try {
      const { id } = req.params
      // Validate id
      if (!id || isNaN(id)) {
        return next(new ApiError([{ message: 'Wrong format.' }], 400))
      }
      // Check if article exists
      const article = await articleRepository.getArticleById(id)
      if (!article) {
        return next(new ApiError([{ message: 'This article is not found' }], 404))
      }
      // Return success message
      return response(res).success({ article })
    } catch (err) {
      return next(err)
    }
  }
  return {
    // Other exported functions...
    readArticle,
  }
}
module.exports = ArticleController
