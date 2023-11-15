// PATH: /controllers/ArticleController.js
const articleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')
const util = require('../utils/util')
const ApiError = require('../utils/api-error')
const { validateId } = require('../utils')
const ArticleController = () => {
  const getArticles = async (req, res, next) => {
    // ... existing code ...
  }
  const getArticlesList = async (req, res, next) => {
    try {
      let page = parseInt(req.query.page)
      let limit = parseInt(req.query.limit)
      // Validate page and limit
      if (isNaN(page) || page < 1) {
        return next(new ApiError('Wrong format. Page must be greater than 0.', 400))
      }
      if (isNaN(limit)) {
        return next(new ApiError('Wrong format.', 400))
      }
      // Fetch articles from the repository
      const { articles, total } = await articleRepository.getArticles(page, limit)
      // Format the articles
      const formattedArticles = articles.map(article => {
        return {
          id: article.id,
          title: util.trimText(article.title, 2),
          description: util.trimText(article.description, 2),
          created_at: article.created_at
        }
      })
      // Calculate total pages
      const totalPages = util.calculateTotalPages(total, limit)
      // Return the response
      return response(res).success({
        articles: formattedArticles,
        totalPages: totalPages,
        limit: limit,
        page: page
      })
    } catch (err) {
      next(err)
    }
  }
  const getArticleDetails = async (req, res, next) => {
    try {
      const { id } = req.params
      // Validate the "id"
      if (!validateId(id)) {
        return next(new ApiError('Wrong format.', 400))
      }
      // Fetch the article from the database
      const article = await articleRepository.findById(id)
      // If the article does not exist, return an error
      if (!article) {
        return next(new ApiError('This article is not found.', 404))
      }
      // Prepare the data to be sent back to the user
      const data = {
        id: article.id,
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
    getArticles,
    getArticleDetails,
    getArticlesList
  }
}
module.exports = ArticleController
