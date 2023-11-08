const Article = require('../models/Article');
const response = require('../utils/response');
const ApiError = require('../utils/ApiError');
async function getArticleDetail(req, res) {
  try {
    const articleId = req.params.id;
    if (isNaN(articleId)) {
      throw new ApiError('Wrong format.', 422);
    }
    const article = await Article.getArticleDetail(articleId);
    if (!article) {
      throw new ApiError('This article is not found', 404);
    }
    response(res).success({ article });
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
  getArticleList,
};
