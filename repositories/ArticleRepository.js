const BaseRepository = require('./BaseRepository')
const { Article } = require('../models')
class ArticleRepository extends BaseRepository {
  constructor () {
    super('article')
    this.DEFAULT_LIMIT = 10
    this.DEFAULT_SORT = [['created_at', 'DESC']]
    this.DEFAULT_PAGE = 1
  }
  async getArticles(page = this.DEFAULT_PAGE) {
    if (page < 1) {
      throw new Error('Page number must be a positive integer.')
    }
    const offset = (page - 1) * this.DEFAULT_LIMIT
    const result = await Article.findAndCountAll({
      attributes: ['title', 'description', 'created_at'],
      order: this.DEFAULT_SORT,
      limit: this.DEFAULT_LIMIT,
      offset: offset
    })
    const articles = result.rows.map(article => {
      return {
        ...article,
        title: this.trimText(article.title),
        description: this.trimText(article.description)
      }
    })
    const totalPages = Math.ceil(result.count / this.DEFAULT_LIMIT)
    return {
      articles: articles,
      totalArticles: result.count,
      totalPages: totalPages
    }
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
  trimText(text) {
    const MAX_LENGTH = 100 // Assuming 2 lines of text is approximately 100 characters
    if (text.length > MAX_LENGTH) {
      return text.substring(0, MAX_LENGTH) + '...'
    }
    return text
  }
}
module.exports = new ArticleRepository()
