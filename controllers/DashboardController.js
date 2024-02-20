const rawRepository = require('../repositories/RawRepository')
const response = require('../utils/response')
const Joi = require('@hapi/joi')
const transaction = require('../utils/transaction')
const userRepository = require('../repositories/UserRepository')
const Article = require('../models').Article
const Category = require('../models').Category
const Tag = require('../models').Tag
const ApiError = require('../utils/api-error')
const status = require('http-status')
const DefaultCriteria = require('../criterias/DefaultCriteria')
const ArticleRepository = require('../repositories/ArticleRepository')
const httpStatus = require('http-status')

const validateParameters = (title, date, page, limit) => {
  if (title && title.length > 200) {
    throw new ApiError('You cannot input more than 200 characters.', httpStatus.BAD_REQUEST)
  }
  if (date && isNaN(Date.parse(date))) {
    throw new ApiError('Wrong date format.', httpStatus.BAD_REQUEST)
  }
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    throw new ApiError('Page must be greater than 0.', httpStatus.BAD_REQUEST)
  }
  if (limit && isNaN(limit)) {
    throw new ApiError('Wrong format.', httpStatus.BAD_REQUEST)
  }
}

const DashboardController = () => {
  const version = (req, res) => {
    return response(res)
      .success({ msg: '1.0.0' })
  }

  const highlightUser = async (req, res, next) => {
    try {
      const { 0: data } = await rawRepository.select(`
      SELECT
        *
      FROM
        USER
      LIMIT 1;
      `)

      return response(res)
        .success({
          ...data
        })
    } catch (err) {
      next(err)
    }
  }

  const filterSearchArticles = async (req, res, next) => {
    try {
      const { title, date, page, limit } = req.query

      validateParameters(title, date, page, limit)

      const defaultCriteria = new DefaultCriteria()
      const articleRepository = new ArticleRepository()

      const criteria = defaultCriteria.filter(req, articleRepository.model, articleRepository)
      const articlesData = await articleRepository.pushCriteria(criteria).paginate({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
      })

      return response(res).success({
        articles: articlesData.rows,
        total_pages: articlesData.pages,
        limit: articlesData.limit,
        page: articlesData.page
      })
    } catch (err) {
      next(err)
    }
  }

  const createArticle = async (req, res, next) => {
    const schema = Joi.object({
      title: Joi.string().max(200).required(),
      content: Joi.string().max(10000).required(),
      author_id: Joi.number().required(),
      categories: Joi.array().items(Joi.number()).required(),
      tags: Joi.array().items(Joi.number()).required()
    })

    const { error, value } = schema.validate(req.body)
    if (error) {
      return next(new ApiError(error.details[0].message, status.BAD_REQUEST))
    }

    try {
      const user = await userRepository.findById(value.author_id)
      if (!user) {
        return next(new ApiError('Author not found.', status.NOT_FOUND))
      }

      const result = await transaction.process(async (t) => {
        const article = await Article.create({
          title: value.title,
          content: value.content,
          user_id: value.author_id,
          created_at: new Date(),
          updated_at: new Date()
        }, { transaction: t })

        for (const categoryId of value.categories) {
          const category = await Category.findByPk(categoryId)
          if (!category) {
            throw new ApiError('One or more categories not found.', status.NOT_FOUND)
          }
          await article.addCategory(category, { transaction: t })
        }

        for (const tagId of value.tags) {
          const tag = await Tag.findByPk(tagId)
          if (!tag) {
            throw new ApiError('One or more tags not found.', status.NOT_FOUND)
          }
          await article.addTag(tag, { transaction: t })
        }

        return article
      })

      return response(res).success({
        status: status.CREATED,
        article: {
          id: result.id,
          title: result.title,
          content: result.content,
          author_id: result.user_id,
          created_at: result.created_at
        }
      }, status.CREATED)
    } catch (err) {
      next(err)
    }
  }

  return {
    version,
    highlightUser,
    filterSearchArticles,
    createArticle
  }
}

module.exports = DashboardController
