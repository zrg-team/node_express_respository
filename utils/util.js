const logger = require('./logger')
const ApiError = require('./api-error')
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
  }
}
