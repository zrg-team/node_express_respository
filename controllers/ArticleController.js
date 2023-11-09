const UserRepository = require('../repositories/UserRepository')
const ArticleRepository = require('../repositories/ArticleRepository')
const response = require('../utils/response')
class ArticleController {
  async getArticles(req, res, next) {
    try {
      const { user_id, page } = req.query;
      const { articles, totalItems, totalPages } = await ArticleRepository.getArticles(user_id, page);
      articles.forEach(article => {
        article.title = article.title.length > 50 ? article.title.substring(0, 47) + '...' : article.title;
        article.description = article.description.length > 100 ? article.description.substring(0, 97) + '...' : article.description;
      });
      return response(res).success({ articles, totalItems, totalPages });
    } catch (err) {
      return next(err);
    }
  }
  async getArticleDetail(req, res, next) {
    try {
      const { user_id, article_id } = req.body
      // Verify user
      const user = await UserRepository.findById(user_id)
      if (!user) {
        return response(res).failure('User not found', 404)
      }
      // Fetch article detail
      const article = await ArticleRepository.findById(article_id)
      if (!article) {
        return response(res).failure('Article not found', 404)
      }
      // Check if the user is authorized to view the article
      if (article.user_id !== user_id) {
        return response(res).failure('User not authorized', 403)
      }
      // Return article detail
      return response(res).success({
        title: article.title,
        description: article.description,
        created_at: article.created_at
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = ArticleController
