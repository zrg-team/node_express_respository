/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user_type', {
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
    }
  }, {
    tableName: 'user_type',
    timestamps: false
  })
}
