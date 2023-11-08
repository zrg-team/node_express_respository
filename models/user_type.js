/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  const UserType = sequelize.define('user_type', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'user_types', // Corrected table name to match the provided table name
    timestamps: true, // Enable timestamps to handle created_at and updated_at
    underscored: true // Use snake_case for automatically added timestamp fields
  });
  // Associations can be defined here
  // Example: UserType.hasMany(models.Post, { foreignKey: 'user_type_id' });
  return UserType;
};
