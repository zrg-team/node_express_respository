const BaseRepository = require('./BaseRepository')
class ArticleRepository extends BaseRepository {
  constructor (model) {
    super(model)
  }
  async getArticleDetail (id) {
    if (!id) {
      throw new Error('Invalid article id')
    }
    const article = await this.model.findByPk(id)
    if (!article) {
      throw new Error('Article not found')
    }
    return {
      title: article.title,
      description: article.description,
      created_at: article.created_at
    }
  }
  // Other methods...
}
module.exports = ArticleRepository
