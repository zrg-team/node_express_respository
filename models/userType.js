const hooks = {
  beforeCreate: (userType) => {
    // Add any logic you want to execute before creating a userType
  },
  beforeUpdate: (userType) => {
    // Add any logic you want to execute before updating a userType
  }
}
module.exports = function (sequelize, DataTypes) {
  const UserType = sequelize.define('userType', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at'
    }
  }, {
    hooks,
    tableName: 'user_types'
  });
  UserType.associate = (factory) => {
    factory.UserType.hasMany(factory.User, {
      as: 'users',
      foreignKey: 'user_type_id',
      sourceKey: 'id'
    })
    factory.UserType.associationModels = {
      users: factory.User
    }
  }
  return UserType;
}
