const userRepository = require('../repositories/UserRepository')
const articleRepository = require('../repositories/ArticleRepository')
const ApiError = require('../utils/api-error')
const response = require('../utils/response')
const db = require('../libs/db')
const ArticleController = () => {
  // Other functions...
  const readArticle = async (req, res, next) => {
    try {
      const { user_id, article_id } = req.body
      // Check if user exists
      const user = await userRepository.findOne({ where: { id: user_id } })
      if (!user) {
        return next(new ApiError([{ message: 'User not found.' }], 404))
      }
      // Check if article exists
      const article = await articleRepository.findOne({ where: { id: article_id } })
      if (!article) {
        return next(new ApiError([{ message: 'Article not found.' }], 404))
      }
      // Create new record in user_articles table
      const read_at = new Date()
      await db.user_articles.create({ user_id, article_id, read_at })
      // Return success message
      return response(res).success({ user_id, article_id, read_at })
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
