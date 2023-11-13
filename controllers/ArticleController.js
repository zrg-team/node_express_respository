const ArticleRepository = require('../repositories/ArticleRepository')
const UserRepository = require('../repositories/UserRepository')
const response = require('../utils/response')
const util = require('../utils/util')
const ApiError = require('../utils/ApiError')
class ArticleController {
  async getArticleDetail (req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        throw new ApiError('Invalid article id', 400)
      }
      const article = await ArticleRepository.getArticleDetail(id)
      if (!article) {
        throw new ApiError('Article not found', 404)
      }
      return res.json({
        title: article.title,
        description: article.description,
        created_at: article.created_at
      })
    } catch (error) {
      next(error)
    }
  }
  async recordUserArticleReading(req, res, next) {
    try {
      const { user_id, article_id } = req.body
      const user = await UserRepository.validateUserId(user_id)
      const article = await ArticleRepository.validateArticleId(article_id)
      if (!user || !article) {
        return res.status(400).json({ message: 'Invalid user id or article id' })
      }
      await UserRepository.createUserArticleRecord(user_id, article_id, new Date())
      return res.status(200).json({ message: 'Successfully recorded user article reading' })
    } catch (error) {
      next(error)
    }
  }
  async getArticles (req, res, next) {
    try {
      let { page } = req.query
      page = parseInt(page)
      if (!page || page < 1) {
        return response.error(res, 'Invalid page number')
      }
      const articles = await ArticleRepository.getArticles(page)
      const trimmedArticles = articles.map(article => {
        return {
          ...article,
          title: util.trimText(article.title, 2),
          description: util.trimText(article.description, 2)
        }
      })
      const totalArticles = await ArticleRepository.countArticles()
      const totalPages = Math.ceil(totalArticles / 10) // assuming 10 articles per page
      if (totalPages === 1) {
        return response.success(res, {
          articles: trimmedArticles,
          totalArticles
        })
      } else {
        return response.success(res, {
          articles: trimmedArticles,
          totalArticles,
          totalPages
        })
      }
    } catch (error) {
      next(error)
    }
  }
}
module.exports = new ArticleController()
