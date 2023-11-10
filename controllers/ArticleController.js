// PATH: /controllers/ArticleController.js
const ArticleRepository = require('../repositories/ArticleRepository')
const ApiError = require('../utils/api-error')
const authUtils = require('../utils/auth.utils')
class ArticleController {
  ...
  async getArticleDetails(req, res, next) {
    try {
      const { user_id, article_id } = req.params;
      if (isNaN(user_id) || isNaN(article_id)) {
        throw new ApiError(400, 'Wrong format.')
      }
      const user = authUtils.verify(user_id)
      if (!user) {
        throw new ApiError(401, 'Unauthorized')
      }
      const article = await ArticleRepository.getArticle(user_id, article_id)
      if (!article) {
        throw new ApiError(404, 'This article is not found')
      }
      if (article.user_id !== user_id) {
        throw new ApiError(403, 'Forbidden')
      }
      res.status(200).json({
        status: 200,
        article: {
          title: article.title,
          description: article.description,
          created_at: article.created_at
        }
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
