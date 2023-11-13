const BaseRepository = require('./BaseRepository')
const { Op } = require('sequelize')
const { Article } = require('../models')
class UserRepository extends BaseRepository {
  constructor () {
    super('user')
    this.DEFAULT_LIMIT = 10
    this.DEFAULT_SORT = [['created_at', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  async getArticlesByUserId(user_id, page = this.DEFAULT_PAGE) {
    const offset = page * this.DEFAULT_LIMIT
    const articles = await Article.findAll({
      where: { user_id },
      order: this.DEFAULT_SORT,
      limit: this.DEFAULT_LIMIT,
      offset
    })
    const totalItems = await Article.count({ where: { user_id } })
    const totalPages = Math.ceil(totalItems / this.DEFAULT_LIMIT)
    return { articles, totalItems, totalPages }
  }
}
module.exports = new UserRepository()
