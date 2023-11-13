const ArticleRepository = require('../repositories/ArticleRepository')
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
