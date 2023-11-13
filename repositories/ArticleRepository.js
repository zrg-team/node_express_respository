const BaseRepository = require('./BaseRepository')
const sequelizeUtils = require('../utils/sequelizeUtils')
class ArticleRepository extends BaseRepository {
  constructor (model) {
    super(model)
  }
  async validateArticleId (id) {
    const article = await this.model.findByPk(id)
    return !!article
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
  async recordUserArticleReading(userId, articleId) {
    const userArticle = await this.model.create({
      user_id: userId,
      article_id: articleId,
      read_at: new Date()
    })
    return userArticle
  }
  async getArticles (page) {
    if (page < 1) {
      throw new Error('Page number must be a positive integer.')
    }
    const limit = 10
    const offset = (page - 1) * limit || 0
    const result = await this.model.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit: limit,
      offset: offset
    })
    const pagination = sequelizeUtils.paginate(page, limit, result.count)
    return {
      data: this.formatArticles(result.rows),
      ...pagination
    }
  }
  formatArticles (articles) {
    return articles.map(article => ({
      ...article,
      title: this.trimToTwoLines(article.title),
      description: this.trimToTwoLines(article.description)
    }))
  }
  trimToTwoLines (text) {
    const lines = text.split('\n')
    return lines.length > 2 ? lines.slice(0, 2).join('\n') : text
  }
}
module.exports = ArticleRepository
