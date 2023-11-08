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
const getArticleList = async (page, limit) => {
  try {
    if (!page || !limit || isNaN(page) || isNaN(limit)) {
      throw new ApiError('Wrong format.');
    }
    if (page < 1) {
      throw new ApiError('Page must be greater than 0.');
    }
    const offset = (page - 1) * limit;
    const articles = await Article.findAll({ offset, limit });
    if (!articles.length) {
      throw new ApiError('No articles found');
    }
    const totalArticles = await Article.count();
    const totalPages = Math.ceil(totalArticles / limit);
    return {
      status: 200,
      articles,
      total_pages: totalPages,
      limit,
      page
    };
  } catch (error) {
    traceError(error);
  }
};
module.exports = {
  getArticleDetail,
  getArticleList,
};
