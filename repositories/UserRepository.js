const BaseRepository = require('./BaseRepository')
class UserRepository extends BaseRepository {
  constructor () {
    super('user')
    this.DEFAULT_LIMIT = 20
    this.DEFAULT_SORT = [['id', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  async createUserArticleRecord(userId, articleId, date) {
    // Validate user and article IDs
    const user = await this.model('user').findOne({ where: { id: userId } })
    const article = await this.model('article').findOne({ where: { id: articleId } })
    if (!user || !article) {
      throw new Error('Invalid user or article ID')
    }
    // Create new record in user_articles table
    return this.model('user_articles').create({
      user_id: userId,
      article_id: articleId,
      read_at: date
    })
  }
}
module.exports = new UserRepository()
