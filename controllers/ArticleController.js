const ArticleRepository = require('../repositories/ArticleRepository')
class ArticleController {
  async getArticleDetail (req, res, next) {
    try {
      const { id } = req.params
      if (!id) {
        return res.status(400).json({ message: 'Invalid article id' })
      }
      const article = await ArticleRepository.getArticleDetail(id)
      if (!article) {
        return res.status(404).json({ message: 'Article not found' })
      }
      return res.json(article)
    } catch (error) {
      next(error)
    }
  }
}
module.exports = new ArticleController()
