const ArticleRepository = require('../repositories/ArticleRepository');
const response = require('../utils/response');
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
}
module.exports = ArticleController;
