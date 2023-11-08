/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: { // Updated to 'username' to match the column name in the table
      type: DataTypes.STRING(255),
      allowNull: false
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
      allowNull: false // Updated to false as created_at should not be nullable
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false // Updated to false as updated_at should not be nullable
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    logged_in: { // Added new field 'logged_in' to match 'is_logged_in' in the table
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'is_logged_in' // Updated to match the column name in the table
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true // Added to ensure the model uses snake_case as in the table
  });
  User.associate = function(models) {
    User.hasMany(models.Article, { // Corrected the association to hasMany and referenced the correct model
      foreignKey: 'user_id',
      as: 'articles'
    });
  };
  return User;
};
