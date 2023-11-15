// PATH: /controllers/ArticleController.js
const articleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')
const util = require('../utils/util')
const ApiError = require('../utils/api-error')
const { validateId } = require('../utils')
const ArticleController = () => {
  const getArticles = async (req, res, next) => {
    try {
      let page = req.query.page
      page = util.validatePage(page) ? page : 1
      const articles = await articleRepository.getArticles(page, 10, { order: { created_at: 'DESC' } })
      const formattedArticles = articles.map(article => {
        return {
          title: util.trimText(article.title, 2),
          description: util.trimText(article.description, 2),
          created_at: article.created_at
        }
      })
      const totalPages = util.calculateTotalPages(articles.length, 10)
      return response(res)
        .success({
          articles: formattedArticles,
          totalPages: totalPages
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
    getArticles,
    getArticleDetails
  }
}
module.exports = ArticleController
