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

class CategoryNotFoundError extends ApiError {
  constructor(message = ERROR_MESSAGES.CATEGORY_NOT_FOUND) {
    super(message, httpStatus.NOT_FOUND);
  }
}

class TagNotFoundError extends ApiError {
  constructor(message = ERROR_MESSAGES.TAG_NOT_FOUND) {
    super(message, httpStatus.NOT_FOUND);
  }
}

class UserNotFoundError extends ApiError {
  constructor(message = ERROR_MESSAGES.USER_NOT_FOUND) {
    super(message, httpStatus.NOT_FOUND);
  }
}

class ContentRequiredError extends ApiError {
  constructor(message = ERROR_MESSAGES.CONTENT_REQUIRED) {
    super(message, httpStatus.BAD_REQUEST);
  }
}

class EmailAlreadyExistsError extends ApiError {
  constructor(message = ERROR_MESSAGES.EMAIL_ALREADY_EXISTS) {
    super(message, httpStatus.CONFLICT);
  }
}

class InvalidEmailFormatError extends ApiError {
  constructor(message = ERROR_MESSAGES.INVALID_EMAIL_FORMAT) {
    super(message, httpStatus.BAD_REQUEST);
  }
}

class PasswordMismatchError extends ApiError {
  constructor(message = ERROR_MESSAGES.PASSWORD_MISMATCH) {
    super(message, httpStatus.BAD_REQUEST);
  }
}

class ServerError extends ApiError {
  constructor(message = ERROR_MESSAGES.SERVER_ERROR) {
    super(message, httpStatus.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  ApiError,
  ArticleNotFoundError,
  CategoryNotFoundError,
  TagNotFoundError,
  UserNotFoundError,
  ContentRequiredError,
  EmailAlreadyExistsError,
  InvalidEmailFormatError,
  PasswordMismatchError,
  ServerError
};
