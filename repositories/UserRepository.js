const BaseRepository = require('./BaseRepository')
const sequelizeUtils = require('../utils/sequelizeUtils')
class UserRepository extends BaseRepository {
  constructor () {
    super('user')
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  async getArticleById(article_id) {
    const article = await sequelizeUtils.findOne('articles', { id: article_id })
    if (!article) {
      return null
    }
    return article
  }
  async getUserById(user_id) {
    const user = await sequelizeUtils.findOne('users', { id: user_id })
    if (!user) {
      return null
    }
    return user
  }
  async readArticle(user_id, article_id) {
    const user = await this.getUserById(user_id)
    const article = await this.getArticleById(article_id)
    if (!user || !article) {
      throw new Error('User or Article does not exist')
    }
    const readAt = new Date()
    const userArticle = await sequelizeUtils.create('user_articles', { user_id, article_id, read_at: readAt })
    return {
      message: 'Success',
      user_id: user.id,
      article_id: article.id,
      read_at: readAt
    }
  }
}
module.exports = new UserRepository()
