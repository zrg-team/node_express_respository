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
    // Check if the user ID and the article ID are positive integers
    if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(articleId) || articleId <= 0) {
      return false;
    }
    // Check if the user ID and the article ID exist in the "users" and "articles" tables respectively
    const userExists = await sequelizeUtils.checkIfExists('users', userId);
    const articleExists = await sequelizeUtils.checkIfExists('articles', articleId);
    if (!userExists || !articleExists) {
      return false;
    }
    // If all checks pass, return true
    return true;
  },
  markArticleAsRead: async (userId, articleId) => {
    // Check if a record already exists for the given user ID and article ID in the "user_articles" table
    const recordExists = await sequelizeUtils.checkIfExists('user_articles', { userId, articleId });
    if (!recordExists) {
      // If a record does not exist, create a new record with the user ID, article ID, and the current date and time as "read_at"
      await sequelizeUtils.create('user_articles', { userId, articleId, read_at: moment().format() });
    } else {
      // If a record does exist, update the "read_at" field with the current date and time
      await sequelizeUtils.update('user_articles', { userId, articleId }, { read_at: moment().format() });
    }
    // Return a success message
    return 'Article has been marked as read by the user';
  }
}
