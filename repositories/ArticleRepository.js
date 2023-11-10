const BaseRepository = require('./BaseRepository')
const RepositoryHelper = require('../utils/repositoryHelper')
class ArticleRepository extends BaseRepository {
  constructor () {
    super('article')
  }
  async getArticleDetail(user_id, article_id) {
    if (typeof user_id !== 'number' || typeof article_id !== 'number') {
      throw new Error('Wrong format.')
    }
    const Article = RepositoryHelper.getModel('article')
    const article = await Article.findOne({ 
      where: { id: article_id, user_id: user_id }, 
      attributes: ['title', 'description', 'created_at'] 
    })
    if (!article) {
      throw new Error('This article is not found or you are not authorized to view it')
    }
    return article
  }
}
module.exports = new ArticleRepository()
