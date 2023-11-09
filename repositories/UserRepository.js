const BaseRepository = require('./BaseRepository')
const { Article } = require('../models')
const { Op } = require('sequelize')
class UserRepository extends BaseRepository {
  constructor () {
    super('user')
    this.DEFAULT_LIMIT = 10
    this.DEFAULT_SORT = [['created_at', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  async findArticlesByUserId(user_id, page = this.DEFAULT_PAGE) {
    try {
      const offset = page * this.DEFAULT_LIMIT
      const articles = await Article.findAndCountAll({
        where: { user_id },
        order: this.DEFAULT_SORT,
        limit: this.DEFAULT_LIMIT,
        offset: offset
      })
      const totalPages = Math.ceil(articles.count / this.DEFAULT_LIMIT)
      const result = {
        articles: articles.rows.map(article => {
          return {
            ...article.dataValues,
            title: this.trimText(article.dataValues.title, 2),
            description: this.trimText(article.dataValues.description, 2)
          }
        }),
        totalItems: articles.count,
        totalPages: totalPages
      }
      return result
    } catch (error) {
      throw error
    }
  }
  trimText(text, lineCount) {
    const MAX_CHAR_PER_LINE = 50
    const MAX_CHAR = lineCount * MAX_CHAR_PER_LINE
    if (text.length > MAX_CHAR) {
      return text.substring(0, MAX_CHAR) + '...'
    }
    return text
  }
}
module.exports = new UserRepository()
