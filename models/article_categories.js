const hooks = {}
module.exports = function (sequelize, DataTypes) {
  const ArticleCategories = sequelize.define('article_categories', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    hooks,
    tableName: 'article_categories'
  })
  ArticleCategories.associate = (factory) => {
    factory.ArticleCategories.belongsTo(factory.Articles, {
      as: 'article',
      foreignKey: 'article_id',
      sourceKey: 'id'
    })
    factory.ArticleCategories.belongsTo(factory.Categories, {
      as: 'category',
      foreignKey: 'category_id',
      sourceKey: 'id'
    })
    factory.ArticleCategories.associationModels = {
      article: factory.Articles,
      category: factory.Categories
    }
  }
  return ArticleCategories
}
