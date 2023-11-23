const { UserArticle } = require('../models');
const { User } = require('../models');
const { Article } = require('../models');
class UserArticlesRepository {
  // ...
  async findUserArticle(user_id, article_id) {
    // Validate user_id and article_id
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
    return await UserArticle.findOne({
      where: {
        user_id: user_id,
        article_id: article_id
      }
    });
  }
  async updateUserArticle(user_id, article_id, read_at) {
    return await UserArticle.update(
      { read_at: read_at },
      {
        where: {
          user_id: user_id,
          article_id: article_id
        }
      }
    );
  }
  async createUserArticle(user_id, article_id, read_at) {
    return await UserArticle.create({
      user_id: user_id,
      article_id: article_id,
      read_at: read_at
    });
  }
}
module.exports = new UserArticlesRepository();
