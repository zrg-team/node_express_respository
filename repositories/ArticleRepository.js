const BaseRepository = require('./BaseRepository')
const RepositoryHelper = require('../utils/repositoryHelper')
class ArticleRepository extends BaseRepository {
  constructor () {
    super('article')
  }
  async getArticle(user_id, article_id) {
    const Article = RepositoryHelper.getModel('article')
    const article = await Article.findOne({ where: { id: article_id, user_id: user_id } })
    if (!article) {
      throw new Error('Unauthorized or Article not found')
    }
    return article
  }
}
module.exports = new ArticleRepository()
