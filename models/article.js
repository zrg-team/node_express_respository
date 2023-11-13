const hooks = {
  beforeCreate: (article) => {
    article.createdAt = new Date();
    article.updatedAt = new Date();
  },
  beforeUpdate: (article) => {
    article.updatedAt = new Date();
  }
}
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
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    hooks,
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
