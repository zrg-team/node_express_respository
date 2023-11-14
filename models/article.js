module.exports = function (sequelize, DataTypes) {
  const Article = sequelize.define('article', {
    id: {
      type: DataTypes.INTEGER(11),
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
    title: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: true
    }
  }, {
    tableName: 'articles'
  })
  Article.associate = (factory) => {
    factory.Article.hasMany(factory.UserArticle, {
      as: 'userArticles',
      foreignKey: 'article_id',
      sourceKey: 'id'
    })
    factory.Article.associationModels = {
      userArticles: factory.UserArticle
    }
  }
  return Article
}
