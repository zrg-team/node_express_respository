const httpStatus = require('http-status');

const ERROR_MESSAGES = {
  ARTICLE_NOT_FOUND: 'Article not found.',
  CATEGORY_NOT_FOUND: 'Category not found.',
  MISSING_ARTICLE_OR_CATEGORY_ID: 'Article ID and Category ID are required.'
};

class ExtendableError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

class ApiError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   */
  static get ERROR_MESSAGES() {
    return ERROR_MESSAGES;
  }

  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status);
  }
}

class ArticleNotFoundError extends ApiError {
  constructor(message = ERROR_MESSAGES.ARTICLE_NOT_FOUND) {
    super(message, httpStatus.NOT_FOUND);
  }
}

class UserNotFoundError extends ApiError {
  constructor(message = 'User not found') {
    super(message, httpStatus.NOT_FOUND);
  }
}

class ContentRequiredError extends ApiError {
  constructor(message = 'The content is required') {
    super(message, httpStatus.BAD_REQUEST);
  }
}

module.exports = {
  ApiError,
  ArticleNotFoundError,
  UserNotFoundError,
  ContentRequiredError
};
