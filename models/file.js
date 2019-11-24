/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const File = sequelize.define('file', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    url: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    file_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'file',
    timestamps: false
  })
  File.associate = (factory) => {
    factory.File.belongsTo(factory.User, {
      as: 'userOfFile',
      foreignKey: 'user_id',
      sourceKey: 'id'
    })

    factory.File.associationModels = {
      userOfFile: factory.User
    }
  }
  return File
}
