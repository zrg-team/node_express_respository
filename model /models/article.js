// PATH: /models/article.js
module.exports = function (sequelize, DataTypes) {
  const Article = sequelize.define('article', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
      as: 'user',
      foreignKey: 'user_id',
      sourceKey: 'id'
    })
    factory.Article.associationModels = {
      user: factory.User
    }
  }
  return Article
}
