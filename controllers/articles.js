const Article = require('../models/Article');
const User = require('../models/User');
const response = require('../utils/response');
const ApiError = require('../utils/ApiError');
const auth = require('../libs/auth');
const ArticleRepository = require('../repositories/ArticleRepository');
async function getArticleListByUser(req, res) {
  try {
    const userId = req.params.user_id;
    const page = req.params.page || 1;
    const limit = req.params.limit || 10;
    if (isNaN(userId)) {
      throw new ApiError('Wrong format.', 422);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    if (!auth.verify(user)) {
      throw new ApiError('User not logged in', 403);
    }
    const { articles, totalItems, totalPages } = await ArticleRepository.getArticlesByUser(userId, page, limit);
    articles.forEach(article => {
      article.title = article.title.length > 100 ? `${article.title.substring(0, 100)}...` : article.title;
      article.description = article.description.length > 200 ? `${article.description.substring(0, 200)}...` : article.description;
    });
    response(res).success({ articles, totalItems, totalPages });
  } catch (error) {
    if (error instanceof ApiError) {
      response(res).error(error, error.statusCode);
    } else {
      response(res).error(error);
    }
  }
}
module.exports = {
  getArticleListByUser,
};
