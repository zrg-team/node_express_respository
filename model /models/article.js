module.exports = function (sequelize, DataTypes) {
  const Article = sequelize.define('article', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'articles'
  })
  Article.associate = (factory) => {
    factory.Article.belongsTo(factory.User, {
      as: 'userOfArticle',
      foreignKey: 'user_id',
      sourceKey: 'id'
    })
    factory.Article.associationModels = {
      userOfArticle: factory.User
    }
  }
  return Article
}
