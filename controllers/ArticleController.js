const ArticleRepository = require('../repositories/ArticleRepository')
const UserRepository = require('../repositories/UserRepository')
const UserArticlesRepository = require('../repositories/UserArticlesRepository')
const response = require('../utils/response')
const { validatePageNumber, validateUserIdAndArticleId } = require('../utils/util')
const validateId = require('../utils/validateId')
const ApiError = require('../utils/api-error')
const { formatArticles } = require('../utils/articleHelper')
const ArticleController = () => {
  const getArticles = async (req, res, next) => {
    try {
      const page = req.query.page
      if (!validatePageNumber(page)) {
        return response(res).error('Invalid page number', 400)
      }
      const offset = (page - 1) * 10
      const { articles, total } = await ArticleRepository.getArticles(offset)
      const formattedArticles = formatArticles(articles)
      const totalPages = Math.ceil(total / 10)
      return response(res)
        .success({
          articles: formattedArticles,
          total,
          pages: totalPages
        })
    } catch (err) {
      next(err)
    }
  }
  const markAsRead = async (req, res, next) => {
    try {
      const { user_id, article_id } = req.body
      if (!validateUserIdAndArticleId(user_id, article_id)) {
        return next(new ApiError('Invalid user_id or article_id', 400))
      }
      const userExists = await UserRepository.findUserById(user_id)
      const articleExists = await ArticleRepository.findArticleById(article_id)
      if (!userExists || !articleExists) {
        return next(new ApiError('User or Article does not exist', 404))
      }
      const recordExists = await UserArticlesRepository.findUserArticle(user_id, article_id)
      if (recordExists) {
        await UserArticlesRepository.updateReadAt(user_id, article_id)
      } else {
        await UserArticlesRepository.createUserArticle(user_id, article_id)
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
