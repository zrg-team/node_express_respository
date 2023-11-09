const BaseRepository = require('./BaseRepository')
const { Op } = require('sequelize')
class UserRepository extends BaseRepository {
  constructor () {
    super('user')
    this.DEFAULT_LIMIT = 10
    this.DEFAULT_SORT = [['created_at', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  async getArticlesByUserId(userId, page = this.DEFAULT_PAGE) {
    const offset = page * this.DEFAULT_LIMIT
    const articles = await this.model.articles.findAll({
      where: { user_id: userId },
      order: this.DEFAULT_SORT,
      limit: this.DEFAULT_LIMIT,
      offset: offset,
      attributes: ['title', 'description', 'created_at']
    })
    const totalItems = await this.model.articles.count({ where: { user_id: userId } })
    const totalPages = Math.ceil(totalItems / this.DEFAULT_LIMIT)
    return { articles, totalItems, totalPages }
  }
}
module.exports = new UserRepository()
