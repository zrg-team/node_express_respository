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
  trimText: (text, lineCount = 2) => {
    const lines = text.split('\n');
    if (lines.length > lineCount) {
      return lines.slice(0, lineCount).join('\n') + '...';
    }
    return text;
  }
}
