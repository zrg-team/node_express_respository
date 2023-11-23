const ArticleRepository = require('../repositories/ArticleRepository')
const UserRepository = require('../repositories/UserRepository')
const UserArticlesRepository = require('../repositories/UserArticlesRepository')
const response = require('../utils/response')
const { validateUserIdAndArticleId } = require('../utils/util')
const ApiError = require('../utils/api-error')
const ArticleController = () => {
  const getArticles = async (req, res, next) => {
    try {
      let { page } = req.query
      page = page ? parseInt(page) : 1
      if (isNaN(page) || page < 1) {
        return next(new ApiError('Invalid page number', 400))
      }
      const articlesPerPage = 10;
      const offset = (page - 1) * articlesPerPage;
      const articlesData = await ArticleRepository.getArticles(offset, articlesPerPage)
      const totalArticles = await ArticleRepository.getTotalArticles();
      const totalPages = Math.ceil(totalArticles / articlesPerPage);
      const formattedArticles = articlesData.map(article => {
        article.title = article.title.length > 100 ? article.title.substring(0, 100) + '...' : article.title;
        article.description = article.description.length > 200 ? article.description.substring(0, 200) + '...' : article.description;
        return article;
      });
      return response(res).success({ articles: formattedArticles, totalArticles, totalPages })
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
      const article = await ArticleRepository.findArticleById(article_id)
      if (!user || !article) {
        return next(new ApiError('User or Article does not exist', 404))
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
