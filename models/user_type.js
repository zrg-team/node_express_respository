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
    // Adding the created_at and updated_at fields
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'user_types', // Correcting the table name to match the provided table
    timestamps: true, // Enabling Sequelize to manage created_at and updated_at
    underscored: true // Ensuring the column names are snake_cased
  });
  // Associations can be defined here
  // Example: UserType.hasMany(models.User, { foreignKey: 'user_type_id' });
  return UserType;
}
