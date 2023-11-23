const ArticleRepository = require('../repositories/ArticleRepository')
const UserRepository = require('../repositories/UserRepository')
const UserArticlesRepository = require('../repositories/UserArticlesRepository')
const response = require('../utils/response')
const { validatePageNumber, validateUserIdAndArticleId } = require('../utils/util')
const ApiError = require('../utils/api-error')
const { formatArticleData } = require('../utils/articleHelper')
const ArticleController = () => {
  const getArticles = async (req, res, next) => {
    try {
      let { page } = req.query
      if (!validatePageNumber(page)) {
        return next(new ApiError('Invalid page number', 400))
      }
      const articlesPerPage = 10;
      const offset = (page - 1) * articlesPerPage;
      const { articles, total } = await ArticleRepository.getArticles(offset, articlesPerPage)
      const formattedArticles = formatArticleData(articles);
      const totalPages = Math.ceil(total / articlesPerPage);
      return response(res).success({ articles: formattedArticles, total, totalPages })
    } catch (err) {
      return next(err)
    }
  }
  const markAsRead = async (req, res, next) => {
    try {
      const { user_id, article_id } = req.body
      if (!validateUserIdAndArticleId(user_id, article_id)) {
        return next(new ApiError('Invalid user_id or article_id', 400))
      }
      const user = await UserRepository.findUserById(user_id)
      if (!user) {
        return next(new ApiError('User not found', 404))
      }
      const article = await ArticleRepository.findArticleById(article_id)
      if (!article) {
        return next(new ApiError('Article not found', 404))
      }
      const userArticle = await UserArticlesRepository.findUserArticle(user_id, article_id)
      if (userArticle) {
        await UserArticlesRepository.updateUserArticle(userArticle, new Date())
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
