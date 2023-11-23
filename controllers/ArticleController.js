const ArticleRepository = require('../repositories/ArticleRepository')
const UserRepository = require('../repositories/UserRepository')
const UserArticlesRepository = require('../repositories/UserArticlesRepository')
const response = require('../utils/response')
const { validatePageNumber, validateUserIdAndArticleId } = require('../utils/util')
const ApiError = require('../utils/api-error')
const ArticleController = () => {
  const getArticles = async (req, res, next) => {
    // ... existing code ...
  }
  const markAsRead = async (req, res, next) => {
    try {
      const { user_id, article_id } = req.body
      // Validate user_id and article_id
      if (!validateUserIdAndArticleId(user_id, article_id)) {
        return next(new ApiError('Invalid user_id or article_id', 400))
      }
      // Check if user and article exist
      const userExists = await UserRepository.findUserById(user_id)
      const articleExists = await ArticleRepository.findArticleById(article_id)
      if (!userExists || !articleExists) {
        return next(new ApiError('User or Article does not exist', 404))
      }
      // Check if record exists
      const recordExists = await UserArticlesRepository.findUserArticle(user_id, article_id)
      if (recordExists) {
        // Update record
        await UserArticlesRepository.updateReadAt(user_id, article_id)
      } else {
        // Create new record
        await UserArticlesRepository.createUserArticle(user_id, article_id)
      }
      // Return success response
      return response(res).success({ message: 'Article has been marked as read' })
    } catch (err) {
      return next(err)
    }
  }
  return {
    getArticles,
    markAsRead
  }
}
module.exports = ArticleController
