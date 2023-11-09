const BaseRepository = require('./BaseRepository')
const RepositoryHelper = require('../utils/repositoryHelper')
class ArticleRepository extends BaseRepository {
  constructor () {
    super('article')
  }
  async getArticle(article_id) {
    if (typeof article_id !== 'number') {
      throw new Error('Wrong format.')
    }
    const Article = RepositoryHelper.getModel('article')
    const article = await Article.findOne({ where: { id: article_id } })
    if (!article) {
      throw new Error('This article is not found')
    }
    return article
  }
}
module.exports = new ArticleRepository()
