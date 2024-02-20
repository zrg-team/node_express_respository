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
      references: { model: 'articles', key: 'id' }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: { model: 'tags', key: 'id' }
    }
  }, {});
  return ArticleTag;
};
