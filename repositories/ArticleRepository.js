const BaseRepository = require('./BaseRepository')
const sequelizeUtils = require('../utils/sequelizeUtils')
const UserArticleRepository = require('./UserArticleRepository')
class ArticleRepository extends BaseRepository {
  constructor () {
    super('article')
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  async getArticles(page = this.DEFAULT_PAGE, limit = this.DEFAULT_LIMIT) {
    if (typeof page !== 'number' || typeof limit !== 'number') {
      throw new Error('Wrong format.')
    }
    if (page < 1) {
      throw new Error('Page must be greater than 0.')
    }
    try {
      const offset = (page - 1) * limit
      const articles = await this.model.findAll({
        attributes: ['id', 'title', 'content', 'author_id', 'created_at'],
        order: [['created_at', 'DESC']],
        limit,
        offset
      })
      const count = await this.model.count()
      const totalPages = Math.ceil(count / limit)
      return { status: 200, articles, total_pages: totalPages, limit, page }
    } catch (error) {
      sequelizeUtils.handleDatabaseError(error)
    }
  }
  async checkArticleExists(article_id) {
    try {
      const article = await this.model.findOne({ where: { id: article_id } })
      return !!article
    } catch (error) {
      sequelizeUtils.handleDatabaseError(error)
    }
  }
  async readArticle(user_id, article_id) {
    try {
      const userExists = await this.model.findOne({ where: { id: user_id } })
      const articleExists = await this.checkArticleExists(article_id)
      if (!userExists || !articleExists) {
        throw new Error('User or Article does not exist')
      }
      const readAt = new Date()
      await UserArticleRepository.create({ user_id, article_id, read_at: readAt })
      return { message: 'Success', user_id, article_id, read_at: readAt }
    } catch (error) {
      sequelizeUtils.handleDatabaseError(error)
    }
  }
}
module.exports = new ArticleRepository()
