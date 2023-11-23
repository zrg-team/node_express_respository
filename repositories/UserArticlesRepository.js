const { UserArticle } = require('../models');
const { User } = require('../models');
const { Article } = require('../models');
const sequelizeUtils = require('../utils/sequelizeUtils');
class UserArticlesRepository {
  async findUserArticle(user_id, article_id) {
    return await sequelizeUtils.findOne(UserArticle, {
      where: {
        user_id: user_id,
        article_id: article_id
      }
    });
  }
  async createUserArticle(user_id, article_id, read_at) {
    return await sequelizeUtils.create(UserArticle, {
      user_id: user_id,
      article_id: article_id,
      read_at: read_at
    });
  }
  async updateReadAt(user_id, article_id, read_at) {
    return await sequelizeUtils.update(UserArticle, 
      { read_at: read_at },
      {
        where: {
          user_id: user_id,
          article_id: article_id
        }
      }
    );
  }
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
    let userArticle = await this.findUserArticle(user_id, article_id);
    if (!userArticle) {
      userArticle = await this.createUserArticle(user_id, article_id, new Date());
    } else {
      userArticle = await this.updateReadAt(user_id, article_id, new Date());
    }
    return 'Article has been marked as read by the user';
  }
}
module.exports = new UserArticlesRepository();
