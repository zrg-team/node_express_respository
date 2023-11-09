const Article = require('../models/Article');
const User = require('../models/User');
const response = require('../utils/response');
const ApiError = require('../utils/ApiError');
const auth = require('../libs/auth');
const ArticleRepository = require('../repositories/ArticleRepository');
class ArticlesController {
  async getArticlesByUserId(req, res) {
    try {
      const { user_id, page = 1 } = req.params;
      const { articles, total, totalPages } = await ArticleRepository.getByUserId(user_id, page);
      if (!articles || articles.length === 0) {
        return res.status(404).json({ message: 'No articles found' });
      }
      return res.status(200).json({ articles, total, totalPages });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  async getArticleDetail(req, res) {
    try {
      // Verify if the user is logged in
      const token = req.headers.authorization.split(' ')[1];
      auth.verify(token, (err, user) => {
        if (err) {
          throw new ApiError('User is not authenticated', 401);
        }
      });
      const userId = req.params.user_id;
      const articleId = req.params.article_id;
      // Get article by article id
      const article = await ArticleRepository.getById(articleId);
      if (!article) {
        throw new ApiError('No article found with this id', 404);
      }
      // Check if the user is authorized to view the article
      if (article.user_id !== userId) {
        throw new ApiError('User is not authorized to view this article', 403);
      }
      // Return article detail
      response(res).success({ 
        title: article.title,
        description: article.description,
        created_at: article.created_at
      });
    } catch (error) {
      if (error instanceof ApiError) {
        response(res).error(error, error.statusCode);
      } else {
        response(res).error(error);
      }
    }
  }
}
module.exports = new ArticlesController();
