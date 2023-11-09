const Article = require('../models/Article');
const User = require('../models/User');
const response = require('../utils/response');
const ApiError = require('../utils/ApiError');
const auth = require('../libs/auth');
const ArticleRepository = require('../repositories/ArticleRepository');
async function getArticleDetail(req, res) {
  try {
    // Verify if the user is logged in
    const token = req.headers.authorization.split(' ')[1];
    auth.verify(token, (err, user) => {
      if (err) {
        throw new ApiError('User is not authenticated', 401);
      }
    });
    const articleId = req.params.article_id;
    if (isNaN(articleId)) {
      throw new ApiError('Wrong format.', 422);
    }
    const article = await ArticleRepository.get(articleId);
    if (!article) {
      throw new ApiError('This article is not found', 404);
    }
    // Return additional article details
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
module.exports = {
  getArticleDetail,
  getArticleListByUser,
};
