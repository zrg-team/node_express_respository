const BaseRepository = require('./BaseRepository')
class ArticleRepository extends BaseRepository {
  constructor () {
    super('article')
  }
  async getArticleDetail (id) {
    if (!id) {
      throw new Error('Invalid article id')
    }
    const article = await this.model.findByPk(id)
    if (!article) {
      throw new Error('Article not found')
    }
    return article
  }
}
module.exports = new ArticleRepository()
