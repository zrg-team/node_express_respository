const Article = require('../models/Article');
const { ApiError } = require('../utils/ApiError');
const { traceError } = require('../utils/util');
const getArticleDetail = async (articleId) => {
  try {
    if (!articleId) {
      throw new ApiError('Invalid article id');
    }
    const article = await Article.findByPk(articleId);
    if (!article) {
      throw new ApiError('Article not found');
    }
    return {
      title: article.title,
      description: article.description,
      created_at: article.created_at
    };
  } catch (error) {
    traceError(error);
  }
};
module.exports = {
  getArticleDetail,
};
