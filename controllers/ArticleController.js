// PATH: /controllers/ArticleController.js
const userRepository = require('../repositories/UserRepository')
const articleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')
const util = require('../utils/util')
const ApiError = require('../utils/api-error')
const { validateId } = require('../utils')
const auth = require('../utils/auth')
const ArticleController = () => {
  // ... existing code ...
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
