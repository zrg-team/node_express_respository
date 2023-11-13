const logger = require('./logger')
const ApiError = require('./api-error')
const status = require('http-status')
module.exports = {
  traceError: (error) => {
    if (error instanceof ApiError && error.status === status.BAD_REQUEST) {
      error.message = JSON.stringify(error.message)
    }
    logger.error(error instanceof Error ? error.stack : error)
  },
  trimLongText: (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  },
  trimArticleData: (article) => {
    const maxLength = 100; // Define the maximum length of title and description
    if (article.title.length > maxLength) {
      article.title = module.exports.trimLongText(article.title, maxLength);
    }
    if (article.description.length > maxLength) {
      article.description = module.exports.trimLongText(article.description, maxLength);
    }
    return article;
  }
}
