const BaseRepository = require('./BaseRepository')
class ArticleRepository extends BaseRepository {
  constructor () {
    super('article')
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  async getArticleById(id) {
    if (typeof id !== 'number' || id <= 0) {
      throw new Error('Invalid ID. ID must be a positive integer.')
    }
    const article = await this.model.findOne({
      where: { id },
      attributes: ['title', 'description', 'created_at']
    })
    if (!article) {
      throw new Error('Article not found.')
    }
    return article
  }
}
module.exports = new ArticleRepository()
