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
    timestamps: true, // Enable timestamps
    createdAt: 'created_at', // Map the 'createdAt' field to the 'created_at' column
    updatedAt: 'updated_at' // Map the 'updatedAt' field to the 'updated_at' column
  });
  // Define associations here if needed, for example:
  // UserType.associate = function(models) {
  //   UserType.hasMany(models.User, {
  //     foreignKey: 'user_type_id',
  //     as: 'users'
  //   });
  // };
  return UserType;
}
