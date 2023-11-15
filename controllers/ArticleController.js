// PATH: /controllers/ArticleController.js
const ApiError = require('../utils/api-error')
const response = require('../utils/response')
const articleRepository = require('../repositories/ArticleRepository')
const { validateId } = require('../utils')
const ArticleController = () => {
  const getArticleDetails = async (req, res, next) => {
    try {
      const { id } = req.params
      // Validate the "id"
      if (!validateId(id)) {
        return next(new ApiError('Invalid article id', 400))
      }
      // Fetch the article from the database
      const article = await articleRepository.findById(id)
      // If the article does not exist, return an error
      if (!article) {
        return next(new ApiError('Article not found', 404))
      }
      // Prepare the data to be sent back to the user
      const data = {
        title: article.title,
        description: article.description,
        created_at: article.created_at
      }
      // Return the article details in the response object
      return response(res).success(data)
    } catch (err) {
      return next(err)
    }
  }
  return {
    getArticleDetails
  }
}
module.exports = ArticleController
