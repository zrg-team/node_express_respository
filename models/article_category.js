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
      references: { model: 'articles', key: 'id' }
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: { model: 'categories', key: 'id' }
    }
  }, {});
  ArticleCategory.associate = function(models) {
    // associations can be defined here
    ArticleCategory.belongsTo(models.Article, { foreignKey: 'article_id' });
    ArticleCategory.belongsTo(models.Category, { foreignKey: 'category_id' });
  };
  return ArticleCategory;
};
