
const Joi = require('@hapi/joi')
const status = require('http-status');
const { Article, User, Comment } = require('../models');
const BaseRepository = require('../repositories/BaseRepository');
const auth = require('../libs/auth');
const { sendMail } = require('../libs/email');
const verifyRecaptcha = require('../libs/recaptcha');
const errorHelper = require('../utils/errors');
const bcryptService = require('../utils/bcrypt');
const ApiError = require('../utils/api-error');
const response = require('../utils/response');
const userRepository = require('../repositories/UserRepository');
const articleRepository = require('../repositories/ArticleRepository');
const commentRepository = require('../repositories/CommentRepository');
const DefaultCriteria = require('../criterias/DefaultCriteria');
const SensitiveCriteria = require('../criterias/SensitiveCriteria');

const ERROR_CODES = {
  USER_NOT_EXIST: 'USER_NOT_EXIST',
  RECAPTCHA_NOT_VALID: 'RECAPTCHA_NOT_VALID',
  USER_BANNED: 'USER_BANNED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  PARAMS_ERROR: 'PARAMS_ERROR',
  INVALID_TOKEN: 'INVALID_TOKEN',
  USER_NOT_VERIFY: 'USER_NOT_VERIFY',
  ARTICLE_NOT_FOUND: 'ARTICLE_NOT_FOUND',
  TAG_NOT_FOUND: 'TAG_NOT_FOUND'
}
const defaultCriteria = new DefaultCriteria();
const sensitiveCriteria = new SensitiveCriteria();
const UserController = () => {
  const version = (req, res) => {
    return response(res)
      .success({ msg: '1.0.0' })
  }

  const register = async (req, res, next) => {
    // ... new register function code
  }

  const create = async (req, res, next) => {
    // ... new create function code
  }

  const me = async (req, res, next) => {
    // ... new me function code
  }

  const login = async (req, res, next) => {
    // ... new login function code
  }

  const verify = async (req, res, next) => {
    // ... new verify function code
  }

  const forgotPassword = async (req, res, next) => {
    // ... new forgotPassword function code
  }

  const changePassword = async (req, res, next) => {
    // ... new changePassword function code
  }

  const find = async (req, res, next) => {
    // ... new find function code
  }

  const postComment = async (req, res, next) => {
    const schema = Joi.object({
      article_id: Joi.number().integer().required(),
      user_id: Joi.number().integer().required(),
      content: Joi.string().trim().required()
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return next(new ApiError(error.details[0].message, status.BAD_REQUEST));
    }

    try {
      // Check if the article exists
      const article = await Article.findByPk(value.article_id);
      if (!article) {
        throw new ApiError.ArticleNotFoundError();
      }

      // Check if the user exists
      const user = await User.findByPk(value.user_id);
      if (!user) {
        throw new ApiError.UserNotFoundError();
      }

      // Create a new comment
      const comment = await Comment.create({
        article_id: value.article_id,
        user_id: value.user_id,
        content: value.content,
        created_at: new Date() // Assuming the created_at is handled here
      });

      // Return the comment ID and a success message
      return response(res).commentPostedSuccess(comment);
    } catch (err) {
      next(err);
    }
  }

  const assignArticleToCategory = async (req, res, next) => {
    // ... existing assignArticleToCategory function code
  }

  const tagArticle = async (req, res, next) => {
    // ... existing tagArticle function code
  }

  return {
    me,
    verify,
    create,
    login,
    find,
    changePassword,
    forgotPassword,
    version,
    register,
    postComment,
    assignArticleToCategory,
    tagArticle
  }
}

module.exports = UserController
