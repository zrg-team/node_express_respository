
const httpStatus = require('http-status');

const ERROR_MESSAGES = {
  ARTICLE_NOT_FOUND: 'Article not found.',
  CATEGORY_NOT_FOUND: 'Category not found.',
  MISSING_ARTICLE_OR_CATEGORY_ID: 'Article ID and Category ID are required.',
  TAG_NOT_FOUND: 'Tag not found.',
  USER_NOT_FOUND: 'User not found',
  CONTENT_REQUIRED: 'The content is required',
  EMAIL_ALREADY_EXISTS: 'Email already exists.',
  INVALID_EMAIL_FORMAT: 'Invalid email format.',
  PASSWORD_MISMATCH: 'Password and confirmation do not match.',
  SERVER_ERROR: 'An unexpected error occurred on the server.'
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

class ArticleNotFoundError extends ExtendableError {
  constructor(message = ERROR_MESSAGES.ARTICLE_NOT_FOUND) {
    super(message, httpStatus.NOT_FOUND);
  }
}

class UserNotFoundError extends ExtendableError {
  constructor(message = ERROR_MESSAGES.USER_NOT_FOUND) {
    super(message, httpStatus.NOT_FOUND);
  }
}

// ... other custom error classes

module.exports = {
  ApiError,
  ArticleNotFoundError,
  UserNotFoundError,
  // ... other exported classes
};
