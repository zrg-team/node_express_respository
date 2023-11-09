// PATH: /controllers/UserController.js
const userRepository = require('../repositories/UserRepository')
const articleRepository = require('../repositories/ArticleRepository')
const auth = require('../libs/auth')
const response = require('../utils/response')
const ApiError = require('../utils/api-error')
const status = require('http-status')
const UserController = () => {
  // ... other functions
  const getArticles = async (req, res, next) => {
    try {
      const { user_id, page } = req.params
      const user = await userRepository.findOne({ where: { id: user_id } })
      if (!user) {
        return next(new ApiError('User not found', status.NOT_FOUND))
      }
      const isVerified = auth.utils.verify(user_id)
      if (!isVerified) {
        return next(new ApiError('Unauthorized', status.UNAUTHORIZED))
      }
      const { rows: articles, count: totalItems } = await articleRepository.findArticlesByUserId(user_id, {
        limit: userRepository.DEFAULT_LIMIT,
        offset: (page - 1) * userRepository.DEFAULT_LIMIT,
        order: [['created_at', 'DESC']],
      })
      articles.forEach(article => {
        article.title = article.title.length > 100 ? `${article.title.substring(0, 100)}...` : article.title
        article.description = article.description.length > 100 ? `${article.description.substring(0, 100)}...` : article.description
      })
      const totalPages = Math.ceil(totalItems / userRepository.DEFAULT_LIMIT)
      return response(res).success({ articles, totalItems, totalPages })
    } catch (err) {
      return next(err)
    }
  }
  return {
    // ... other exported functions
    getArticles,
  }
}
module.exports = UserController
