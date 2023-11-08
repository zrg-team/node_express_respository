/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    username: { // New column added
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    logged_in: { // New column added
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  User.associate = function(models) {
    // Association with articles table
    User.hasMany(models.Article, {
      foreignKey: 'user_id',
      as: 'articles'
    });
    // Existing association with user_type table
    User.belongsTo(models.user_type, {
      foreignKey: 'user_type_id',
      as: 'userType'
    });
  };
  return User;
};
