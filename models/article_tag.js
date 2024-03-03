'use strict';
module.exports = (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define('ArticleTag', {
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
    tag_id: {
      type: DataTypes.INTEGER,
      references: { model: 'Tag', key: 'id' }
    }
  }, {});

  ArticleTag.associate = function(models) {
    ArticleTag.belongsTo(models.Article, { foreignKey: 'article_id' });
    ArticleTag.belongsTo(models.Tag, { foreignKey: 'tag_id' });
  };

  return ArticleTag;
};
