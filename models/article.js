
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.belongsTo(models.User, { foreignKey: 'user_id' });
      Article.hasMany(models.Comment, { foreignKey: 'article_id' });
    }

    // Define schema here
  };

  Article.init({
    title: DataTypes.STRING,
    summary: DataTypes.STRING,
    content: DataTypes.TEXT,
    publication_date: DataTypes.DATE,
    category: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Article',
  });

  return Article;
};
