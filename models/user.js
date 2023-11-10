const bcryptService = require('../utils/bcrypt')
const hooks = {
  beforeCreate: (user) => {
    user.password = bcryptService.password(user.password) // eslint-disable-line no-param-reassign
  },
  beforeUpdate: (user) => {
    if (user.changed('password')) {
      user.password = bcryptService.password(user.password) // eslint-disable-line no-param-reassign
    }
  },
  beforeBulkUpdate: (data) => {
    if (data.attributes && data.attributes.password) {
      data.attributes.password = bcryptService.password(data.attributes.password) // eslint-disable-line no-param-reassign
    }
  }
}
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
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
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
    }
  }, {
    hooks,
    tableName: 'users'
  })
  User.associate = (factory) => {
    factory.User.hasMany(factory.Article, {
      as: 'articles',
      foreignKey: 'user_id',
      sourceKey: 'id'
    })
    factory.User.associationModels = {
      articles: factory.Article
    }
  }
  return User
}
