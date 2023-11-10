/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false
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
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: false
  })
}
