const logger = require('./logger')
const ApiError = require('./apiError')
const status = require('http-status')
module.exports = {
  traceError: (error) => {
    if (error instanceof ApiError && error.status === status.BAD_REQUEST) {
      error.message = JSON.stringify(error.message)
    }
    logger.error(error instanceof Error ? error.stack : error)
  },
  validatePageNumber: (pageNumber) => {
    if (pageNumber < 1 || !Number.isInteger(pageNumber)) {
      throw new ApiError('Invalid page number', status.BAD_REQUEST)
    }
  },
  calculateOffset: (pageNumber, articlesPerPage) => {
    return (pageNumber - 1) * articlesPerPage;
  },
  formatArticleData: (article) => {
    const maxLength = 2
    if (article.title.length > maxLength) {
      article.title = `${article.title.substring(0, maxLength)}...`
    }
    if (article.description.length > maxLength) {
      article.description = `${article.description.substring(0, maxLength)}...`
    }
    return article
  },
  calculateTotalPages: (totalArticles, articlesPerPage) => {
    return Math.ceil(totalArticles / articlesPerPage)
  }
}
