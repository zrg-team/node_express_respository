const Joi = require('@hapi/joi')
const status = require('http-status')
const errorHelper = require('../utils/errors')
const ApiError = require('../utils/api-error')
const response = require('../utils/response')
const postRepository = require('../repositories/PostRepository')
const DefaultCriteria = require('../criterias/DefaultCriteria')

const defaultCriteria = new DefaultCriteria()
const PostController = () => {
  const create = async (req, res, next) => {
    try {
      const schema = Joi.object().keys({
        user_id: Joi.number().required(),
        title: Joi.string().min(6).max(60).required(),
        content: Joi.string().required()
      })

      const validater = Joi.validate(req.body, schema, { abortEarly: false })
      if (validater.error) {
        return next(new ApiError(errorHelper.parseErrors(validater.error.details), status.BAD_REQUEST))
      }
      const post = await postRepository.create(validater.value)
      return response(res)
        .success({ ...post.toJSON() })
    } catch (err) {
      next(err)
    }
  }

  const update = async (req, res, next) => {
    try {
      const schema = Joi.object().keys({
        id: Joi.number().required(),
        title: Joi.string().min(6).max(60).required(),
        content: Joi.string().required()
      })

      const validater = Joi.validate(req.body, schema, { abortEarly: false })
      if (validater.error) {
        return next(new ApiError(errorHelper.parseErrors(validater.error.details), status.BAD_REQUEST))
      }
      const post = await postRepository.update(validater.value, { where: { id: validater.value.id } })
      return response(res)
        .success({ ...post.toJSON() })
    } catch (err) {
      next(err)
    }
  }

  const deletePost = async (req, res, next) => {
    try {
      const schema = Joi.object().keys({
        id: Joi.number().required()
      })

      const validater = Joi.validate(req.body, schema, { abortEarly: false })
      if (validater.error) {
        return next(new ApiError(errorHelper.parseErrors(validater.error.details), status.BAD_REQUEST))
      }
      await postRepository.delete({ where: { id: validater.value.id } })
      return response(res)
        .success()
    } catch (err) {
      next(err)
    }
  }

  const find = async (req, res, next) => {
    try {
      const posts = await postRepository
        .pushCriteria(defaultCriteria)
        .apply(req)
        .paginate({})

      return response(res).success({ ...posts })
    } catch (err) {
      return next(err)
    }
  }

  const get = async (req, res, next) => {
    try {
      const schema = Joi.object().keys({
        id: Joi.number().required()
      })

      const validater = Joi.validate(req.params, schema, { abortEarly: false })
      if (validater.error) {
        return next(new ApiError(errorHelper.parseErrors(validater.error.details), status.BAD_REQUEST))
      }
      const post = await postRepository.findOne({ where: { id: validater.value.id } })
      return response(res).success({ ...post.toJSON() })
    } catch (err) {
      return next(err)
    }
  }

  return {
    create,
    update,
    deletePost,
    find,
    get
  }
}

module.exports = PostController
