const hooks = {
  beforeCreate: (article) => {
    article.created_at = new Date();
    article.updated_at = new Date();
  },
  beforeUpdate: (article) => {
    if (article.changed('title') || article.changed('description')) {
      article.updated_at = new Date();
    }
  },
  beforeBulkUpdate: (data) => {
    if (data.attributes && (data.attributes.title || data.attributes.description)) {
      data.attributes.updated_at = new Date();
    }
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
