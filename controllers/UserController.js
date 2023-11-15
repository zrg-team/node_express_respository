const userRepository = require('../repositories/UserRepository')
const articleRepository = require('../repositories/ArticleRepository')
const userArticleRepository = require('../repositories/UserArticleRepository')
const db = require('../utils/db')
const ApiError = require('../utils/api-error')
const response = require('../utils/response')
const UserController = () => {
  // ... other functions
  const readArticle = async (req, res, next) => {
    try {
      const { user_id, article_id } = req.body
      // Check if user exists
      const user = await userRepository.getUserById(user_id)
      if (!user) {
        return next(new ApiError('User does not exist', 404))
      }
      // Check if article exists
      const article = await articleRepository.getArticleById(article_id)
      if (!article) {
        return next(new ApiError('Article does not exist', 404))
      }
      // Create a new record in the 'user_articles' table
      const read_at = new Date()
      await db.user_articles.create({
        user_id,
        article_id,
        read_at
      })
      // Return success message
      return response(res).success({
        message: 'Article read successfully',
        user_id,
        article_id,
        read_at
      })
    } catch (err) {
      return next(err)
    }
  }
  return {
    // ... other functions
    readArticle
  }
}
module.exports = UserController
