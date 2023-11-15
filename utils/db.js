const { User, Article, UserArticle } = require('../models');
const sequelizeUtils = require('./sequelizeUtils');
const createUserArticle = async (user_id, article_id) => {
  // Check if user and article exist
  const user = await User.findByPk(user_id);
  const article = await Article.findByPk(article_id);
  if (!user || !article) {
    throw new Error('User or Article does not exist');
  }
  const read_at = new Date();
  const userArticle = await sequelizeUtils.create(UserArticle, {
    user_id,
    article_id,
    read_at
  });
  return {
    message: 'Success',
    user_id: userArticle.user_id,
    article_id: userArticle.article_id,
    read_at: userArticle.read_at
  };
};
module.exports = {
  createUserArticle,
};
