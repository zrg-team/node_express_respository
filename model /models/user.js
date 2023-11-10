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
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
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
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avatar_file_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    hooks,
    tableName: 'users',
    timestamps: false
  });
  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'user_id',
      as: 'articles'
    });
    User.belongsTo(models.UserType, {
      as: 'userTypeOfUser',
      foreignKey: 'user_type_id',
      sourceKey: 'id'
    });
    User.associationModels = {
      userTypeOfUser: models.UserType
    }
  };
  return User;
};
