const userRepository = require('../repositories/UserRepository')
const articleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')
const util = require('../utils/util')
const ApiError = require('../utils/api-error')
const { validateId } = require('../utils')
const auth = require('../utils/auth')
const ArticleController = () => {
  const getArticles = async (req, res, next) => {
    try {
      let page = parseInt(req.query.page) || 1
      const { articles, total } = await articleRepository.getArticles(page)
      const formattedArticles = articles.map(article => {
        return {
          title: util.trimText(article.title, 100),
          description: util.trimText(article.description, 200),
          created_at: article.created_at
        }
      })
      const totalPages = Math.ceil(total / 10)
      const hidePagination = totalPages === 1
      return response(res).success({
        articles: formattedArticles,
        totalItems: total,
        totalPages: totalPages,
        hidePagination: hidePagination
      })
    } catch (err) {
      next(err)
    }
  }
  const getArticlesList = async (req, res, next) => {
    // ... existing code ...
  }
  const getArticleDetails = async (req, res, next) => {
    // ... existing code ...
  }
  const readArticle = async (req, res, next) => {
    try {
      const { user_id, article_id } = req.body
      // Authenticate the user's request
      if (!auth(req)) {
        return next(new ApiError('User not authenticated.', 401))
      }
      // Check if the user and the article exist
      const user = await userRepository.getById(user_id)
      const article = await articleRepository.getById(article_id)
      if (!user || !article) {
        return next(new ApiError('User or article not found.', 404))
      }
      // Create a new record in the 'user_articles' table
      const read_at = new Date()
      const userArticle = await articleRepository.createUserArticle(user_id, article_id, read_at)
      // Return a success message to the user
      return response(res).success({
        user_id: user_id,
        article_id: article_id,
        read_at: read_at
      })
    } catch (err) {
      return next(err)
    }
  }
  return {
    getArticles,
    getArticleDetails,
    getArticlesList,
    readArticle
  }
}
module.exports = ArticleController
