const ArticleRepository = require('../repositories/ArticleRepository')
const ApiError = require('../utils/ApiError')
class ArticleController {
  async getArticleDetail (req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        throw new ApiError('Invalid article id', 400)
      }
      const article = await ArticleRepository.getArticleDetail(id)
      if (!article) {
        throw new ApiError('Article not found', 404)
      }
      return res.json({
        title: article.title,
        description: article.description,
        created_at: article.created_at
      })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = new ArticleController()
