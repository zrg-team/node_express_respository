const ArticleRepository = require('../repositories/ArticleRepository')
const UserRepository = require('../repositories/UserRepository')
const UserArticlesRepository = require('../repositories/UserArticlesRepository')
const response = require('../utils/response')
const { validateUserIdAndArticleId } = require('../utils/util')
const ApiError = require('../utils/api-error')
const ArticleController = () => {
  const getArticles = async (req, res, next) => {
    // ... existing code ...
  }
  const markAsRead = async (req, res, next) => {
    try {
      const { user_id, article_id } = req.body
      if (!validateUserIdAndArticleId(user_id, article_id)) {
        return next(new ApiError('Invalid user_id or article_id', 400))
      }
      const userExists = await UserRepository.checkUserExists(user_id)
      const articleExists = await ArticleRepository.checkArticleExists(article_id)
      if (!userExists || !articleExists) {
        return next(new ApiError('User or Article does not exist', 404))
      }
      const recordExists = await UserArticlesRepository.checkUserArticleExists(user_id, article_id)
      if (recordExists) {
        await UserArticlesRepository.updateUserArticle(user_id, article_id, new Date())
      } else {
        await UserArticlesRepository.createUserArticle(user_id, article_id, new Date())
      }
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
