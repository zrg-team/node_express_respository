const Article = require('../models/article')
class RepositoryHelper {
  ...
  getModel (name) {
    ...
    let model = null
    switch (name) {
      ...
      case 'Article':
        model = Article(this.sequelize, Sequelize)
        this.factory.Article = model
        break
    }
    return model
  }
  setupAssociations (repo) {
    switch (repo) {
      ...
      case 'article':
        this.factory.Article = this.getModel('Article')
        this.factory.User = this.getModel('User')
        this.factory.Article.associate(this.factory)
        return this.factory.Article
    }
  }
  getArticleList (userId, page) {
    const articles = this.factory.Article.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      include: [{
        model: this.factory.User,
        as: 'user'
      }]
    })
    return this.paginate(articles, page)
  }
  ...
}
module.exports = new RepositoryHelper(dbService.database)
