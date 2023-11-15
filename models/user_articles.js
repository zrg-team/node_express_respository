/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  const UserArticles = sequelize.define('user_articles', {
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
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    article_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'user_articles',
    timestamps: false
  })
  UserArticles.associate = (factory) => {
    factory.UserArticles.belongsTo(factory.User, {
      as: 'user',
      foreignKey: 'user_id',
      sourceKey: 'id'
    })
    factory.UserArticles.belongsTo(factory.Article, {
      as: 'article',
      foreignKey: 'article_id',
      sourceKey: 'id'
    })
    factory.UserArticles.associationModels = {
      user: factory.User,
      article: factory.Article
    }
  }
  return UserArticles
}
