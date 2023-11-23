const BaseRepository = require('./BaseRepository')
const { Article, UserArticle } = require('../models')
const { sequelize } = require('../libs/db')
class ArticleRepository extends BaseRepository {
  constructor () {
    super('article')
    this.DEFAULT_LIMIT = 10
    this.DEFAULT_SORT = [['created_at', 'DESC']]
    this.DEFAULT_PAGE = 1
  }
  async markAsRead(user_id, article_id) {
    if (!Number.isInteger(user_id) || !Number.isInteger(article_id) || user_id <= 0 || article_id <= 0) {
      throw new Error('Invalid user_id or article_id')
    }
    const userExists = await User.findOne({ where: { id: user_id } })
    const articleExists = await Article.findOne({ where: { id: article_id } })
    if (!userExists || !articleExists) {
      throw new Error('User or Article does not exist')
    }
    return sequelize.transaction(async (t) => {
      const userArticle = await UserArticle.findOne({
        where: { user_id, article_id },
        transaction: t
      })
      if (!userArticle) {
        await UserArticle.create({
          user_id,
          article_id,
          read_at: new Date()
        }, { transaction: t })
      } else {
        await userArticle.update({
          read_at: new Date()
        }, { transaction: t })
      }
    })
  }
}
module.exports = new ArticleRepository()
