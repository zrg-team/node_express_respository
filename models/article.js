const hooks = {
  beforeCreate: (article) => {
    // Add any necessary hooks here
  },
  beforeUpdate: (article) => {
    // Add any necessary hooks here
  },
  beforeBulkUpdate: (data) => {
    // Add any necessary hooks here
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
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    publication_date: {
      type: DataTypes.DATE,
      allowNull: true
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
    hooks,
    tableName: 'articles'
  })
  Article.associate = (factory) => {
    factory.Article.belongsTo(factory.User, {
      as: 'user',
      foreignKey: 'user_id',
      sourceKey: 'id'
    })
    factory.Article.belongsTo(factory.ArticleCategory, {
      as: 'category',
      foreignKey: 'category_id',
      sourceKey: 'id'
    })
    factory.Article.associationModels = {
      user: factory.User,
      category: factory.ArticleCategory
    }
  }
  return Article
}
