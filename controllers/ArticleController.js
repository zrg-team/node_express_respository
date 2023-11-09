const ArticleRepository = require('../repositories/ArticleRepository')
const ApiError = require('../utils/api-error')
class ArticleController {
  ...
  async getArticleDetails(req, res, next) {
    try {
      if (isNaN(req.params.id)) {
        throw new ApiError(400, 'Wrong format.')
      }
      const article = await ArticleRepository.getArticle(req.user.id, req.params.id)
      if (!article) {
        throw new ApiError(404, 'This article is not found')
      }
      res.status(200).json({
        status: 200,
        article: article
      })
    } catch (err) {
      if (err instanceof ApiError) {
        next(err)
      } else {
        next(new ApiError(500, err.message))
      }
    }
  }
}
module.exports = new ArticleController()
