// PATH: /controllers/ArticleController.js
const ApiError = require('../utils/api-error')
const ArticleRepository = require('../repositories/ArticleRepository')
const SequelizeUtils = require('../utils/sequelize')
const repositoryHelper = require('../utils/repositoryHelper')
const ArticleController = () => {
  const getArticleDetails = async (req, res, next) => {
    try {
      const { id } = req.params
      const article = await ArticleRepository.findById(id)
      if (!article) {
        return next(new ApiError('Article not found', 404))
      }
      const { title, description, created_at } = SequelizeUtils.getFields(article, ['title', 'description', 'created_at'])
      const trimmedTitle = repositoryHelper.trimText(title, 2)
      const trimmedDescription = repositoryHelper.trimText(description, 2)
      return res.json({
        title: trimmedTitle,
        description: trimmedDescription,
        created_at
      })
    } catch (err) {
      return next(err)
    }
  }
  const getArticles = async (req, res, next) => {
    try {
      const page = req.query.page || 1
      const articles = await ArticleRepository.getArticles(page)
      const paginatedArticles = repositoryHelper.paginate(articles, page, 10)
      const trimmedArticles = paginatedArticles.map(article => {
        const { title, description, created_at } = SequelizeUtils.getFields(article, ['title', 'description', 'created_at'])
        const trimmedTitle = repositoryHelper.trimText(title, 2)
        const trimmedDescription = repositoryHelper.trimText(description, 2)
        return {
          title: trimmedTitle,
          description: trimmedDescription,
          created_at
        }
      })
      return res.json({
        totalItems: trimmedArticles.length,
        totalPages: Math.ceil(trimmedArticles.length / 10),
        articles: trimmedArticles
      })
    } catch (err) {
      return next(err)
    }
  }
  return {
    getArticleDetails,
    getArticles
  }
}
module.exports = ArticleController
