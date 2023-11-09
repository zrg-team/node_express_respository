const Article = require('../models/Article');
const User = require('../models/User');
const response = require('../utils/response');
const ApiError = require('../utils/ApiError');
const auth = require('../libs/auth');
const ArticleRepository = require('../repositories/ArticleRepository');
async function getArticleListByUser(req, res) {
  try {
    // Verify if the user is logged in
    const token = req.headers.authorization.split(' ')[1];
    auth.verify(token, (err, user) => {
      if (err) {
        throw new ApiError('User is not authenticated', 401);
      }
    });
    const userId = req.params.user_id;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;
    // Get articles by user id
    const articles = await ArticleRepository.getByUserId(userId, limit, offset);
    if (!articles) {
      throw new ApiError('No articles found for this user', 404);
    }
    // Trim title and description
    articles.forEach(article => {
      article.title = article.title.length > 100 ? article.title.substring(0, 97) + '...' : article.title;
      article.description = article.description.length > 200 ? article.description.substring(0, 197) + '...' : article.description;
    });
    // Get total articles count
    const totalItems = await ArticleRepository.countByUserId(userId);
    const totalPages = Math.ceil(totalItems / limit);
    // Return articles list
    response(res).success({ 
      articles,
      totalItems,
      totalPages
    });
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
