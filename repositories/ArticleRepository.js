const BaseRepository = require('./BaseRepository')
const sequelizeUtils = require('../utils/sequelizeUtils')
class ArticleRepository extends BaseRepository {
  constructor (model) {
    super(model)
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
  formatArticles(articles) {
    return articles.map(article => {
      return {
        ...article,
        title: this.trimText(article.title, 2),
        description: this.trimText(article.description, 2)
      }
    })
  }
  trimText(text, lines) {
    const maxLength = lines * 50 // Assuming each line can contain 50 characters
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...'
    }
    return text
  }
  // ... other methods
}
module.exports = ArticleRepository
