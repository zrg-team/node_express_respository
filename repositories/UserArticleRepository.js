const BaseRepository = require('./BaseRepository')
const { transaction } = require('sequelize')
const sequelizeUtils = require('../utils/sequelizeUtils')
const User = require('../models/User')
const Article = require('../models/Article')
class UserArticleRepository extends BaseRepository {
  constructor (model) {
    super(model)
  }
  async createUserArticle(user_id, article_id) {
    const user = await User.findByPk(user_id)
    const article = await Article.findByPk(article_id)
    if (!user || !article) {
      throw new Error('User or Article does not exist')
    }
    return transaction(t => {
      return this.model.create({
        user_id,
        article_id,
        read_at: new Date()
      }, { transaction: t })
    })
    .catch(err => {
      throw sequelizeUtils.handleDatabaseError(err)
    })
  }
}
module.exports = UserArticleRepository
