
const rawRepository = require('../repositories/RawRepository')
const response = require('../utils/response')
const ApiError = require('../utils/api-error')
const userRepository = require('../repositories/UserRepository')
const config = require('../config/index')

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

  const updateArticleDetails = async (req, res, next) => {
    try {
      const { id } = req.params
      const { title, content } = req.body
      const { maxTitleLength, maxContentLength } = config.articleUpdate

      if (!id) {
        throw new ApiError('This article is not found.', 400)
      }

      if (isNaN(id)) {
        throw new ApiError('Wrong format.', 422)
      }

      if (title.length > maxTitleLength) {
        throw new ApiError('You cannot input more than 100 characters.', 400)
      }

      if (!title.trim()) {
        throw new ApiError('The title is required.', 400)
      }

      if (content.length > maxContentLength) {
        throw new ApiError('You cannot input more than 10000 characters.', 400)
      }

      // Assuming there is a method in userRepository to update the article
      const updatedArticle = await userRepository.updateArticle(id, { title, content })

      return response(res).success({ article: updatedArticle })
    } catch (err) {
      next(err)
    }
  }

  return {
    version,
    highlightUser,
    updateArticleDetails
  }
}

module.exports = DashboardController
