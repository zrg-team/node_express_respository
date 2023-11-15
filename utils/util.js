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
  trimText: (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }
}
