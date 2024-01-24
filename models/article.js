const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      Article.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'author',
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Article',
    tableName: 'articles',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Article;
};
