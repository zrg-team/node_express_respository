const { UserArticle } = require('../models');
const { User } = require('../models');
const { Article } = require('../models');
const sequelizeUtils = require('../utils/sequelizeUtils');
class UserArticlesRepository {
  async readArticle(user_id, article_id) {
    if (user_id <= 0 || article_id <= 0) {
      throw new Error('User ID and Article ID must be positive integers');
    }
    const user = await User.findByPk(user_id);
    if (!user) {
      throw new Error('User does not exist');
    }
    const article = await Article.findByPk(article_id);
    if (!article) {
      throw new Error('Article does not exist');
    }
    let userArticle = await UserArticle.findOne({
      where: {
        user_id: user_id,
        article_id: article_id
      }
    });
    if (!userArticle) {
      userArticle = await UserArticle.create({
        user_id: user_id,
        article_id: article_id,
        read_at: new Date()
      });
    } else {
      userArticle = await UserArticle.update(
        { read_at: new Date() },
        {
          where: {
            user_id: user_id,
            article_id: article_id
          }
        }
      );
    }
    return 'Article has been marked as read by the user';
  }
}
module.exports = new UserArticlesRepository();
