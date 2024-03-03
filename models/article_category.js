'use strict';
module.exports = (sequelize, DataTypes) => {
  const ArticleCategory = sequelize.define('ArticleCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    article_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Article', key: 'id' }
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Category', key: 'id' }
    }
  }, {});

  ArticleCategory.associate = function(models) {
    ArticleCategory.belongsTo(models.Article, { foreignKey: 'article_id' });
    ArticleCategory.belongsTo(models.Category, { foreignKey: 'category_id' });
  };

  return ArticleCategory;
};
