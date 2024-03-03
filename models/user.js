
const bcryptService = require('../utils/bcrypt')
// ... other hooks and imports

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
    name: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    // ... other columns
    user_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
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
    tableName: 'user'
  })
  User.associate = (factory) => {
    factory.User.belongsTo(factory.UserType, {
      as: 'userTypeOfUser',
      foreignKey: 'user_type_id',
      sourceKey: 'id'
    })

    factory.User.associationModels = {
      userTypeOfUser: factory.UserType
    }

    // Associations for comments and articles
    factory.User.hasMany(factory.Comment, {
      as: 'comments',
      foreignKey: 'user_id'
    });
    factory.User.hasMany(factory.Article, {
      as: 'articles',
      foreignKey: 'user_id'
    });
  }

  return User
}
