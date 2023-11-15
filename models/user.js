/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    avatar_file_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: false
  })
  User.associate = (factory) => {
    factory.User.hasMany(factory.Article, {
      as: 'articles',
      foreignKey: 'user_id',
      sourceKey: 'id'
    })
    factory.User.hasMany(factory.UserArticle, {
      as: 'userArticles',
      foreignKey: 'user_id',
      sourceKey: 'id'
    })
    factory.User.associationModels = {
      articles: factory.Article,
      userArticles: factory.UserArticle
    }
  }
  return User
}
