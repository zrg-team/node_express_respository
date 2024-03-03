const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'author'
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
      autoIncrement: true,
      allowNull: false
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    title: DataTypes.STRING,
    summary: DataTypes.TEXT,
    content: DataTypes.TEXT,
    publication_date: DataTypes.DATE,
    category: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Article',
    tableName: 'articles'
  });

  return Article;
};
