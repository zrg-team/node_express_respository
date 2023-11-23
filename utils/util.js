const logger = require('./logger')
const ApiError = require('./apiError')
const status = require('http-status')
const sequelizeUtils = require('./sequelizeUtils')
const moment = require('moment')
module.exports = {
  traceError: (error) => {
    if (error instanceof ApiError && error.status === status.BAD_REQUEST) {
      error.message = JSON.stringify(error.message)
    }
    logger.error(error instanceof Error ? error.stack : error)
  },
  validateUserIdAndArticleId: async (userId, articleId) => {
    if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(articleId) || articleId <= 0) {
      throw new Error('User ID and Article ID must be positive integers');
    }
    const userExists = await sequelizeUtils.checkIfExists('users', userId);
    const articleExists = await sequelizeUtils.checkIfExists('articles', articleId);
    if (!userExists || !articleExists) {
      throw new Error('User ID or Article ID does not exist');
    }
    return true;
  },
  markArticleAsRead: async (userId, articleId) => {
    await this.validateUserIdAndArticleId(userId, articleId);
    const recordExists = await sequelizeUtils.checkIfExists('user_articles', { userId, articleId });
    if (!recordExists) {
      await sequelizeUtils.create('user_articles', { userId, articleId, read_at: moment().format() });
    } else {
      await sequelizeUtils.update('user_articles', { userId, articleId }, { read_at: moment().format() });
    }
    return 'Article has been marked as read by the user';
  },
  calculateTotalPages: (totalArticles, articlesPerPage) => {
    return Math.ceil(totalArticles / articlesPerPage);
  },
  validatePageNumber: (page) => {
    if (!Number.isInteger(page) || page <= 0) {
      throw new Error('Page number must be a positive integer');
    }
    return page;
  },
  calculateOffset: (page, articlesPerPage) => {
    return (page - 1) * articlesPerPage;
  },
  trimArticleFields: (article) => {
    article.title = article.title.length > 100 ? article.title.substring(0, 100) + '...' : article.title;
    article.description = article.description.length > 200 ? article.description.substring(0, 200) + '...' : article.description;
    return article;
  },
  getArticleList: async (page) => {
    this.validatePageNumber(page);
    const limit = 10;
    const offset = this.calculateOffset(page, limit);
    const articles = await sequelizeUtils.query('articles', { order: [['created_at', 'DESC']], offset, limit });
    const totalArticles = await sequelizeUtils.count('articles');
    const totalPages = this.calculateTotalPages(totalArticles, limit);
    return { articles, totalArticles, totalPages };
  }
}
