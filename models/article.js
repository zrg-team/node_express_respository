const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'author'
      });
      Article.hasMany(models.ArticleCategory, {
        foreignKey: 'article_id',
        as: 'categories'
      });
      Article.hasMany(models.ArticleTag, {
        foreignKey: 'article_id',
        as: 'tags'
      });
      Article.hasMany(models.Comment, {
        foreignKey: 'article_id',
        as: 'comments'
      });
    }
  }

  Article.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    publication_status: DataTypes.STRING,
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Article',
    tableName: 'articles'
  });

  return Article;
};
