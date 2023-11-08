const bcryptService = require('../utils/bcrypt')
// Assuming the new table is called 'new_table' and has similar columns to 'users'
module.exports = function (sequelize, DataTypes) {
  const NewModel = sequelize.define('newModel', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true
    },
    // Add other columns as per the new table's requirements
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Add foreign keys or other attributes as needed
  }, {
    // You can add hooks here if needed, similar to the user model
    tableName: 'new_table'
  });
  NewModel.associate = (factory) => {
    // Define associations here, similar to the user model
    // Example:
    // factory.NewModel.belongsTo(factory.OtherModel, {
    //   as: 'otherModelOfNewModel',
    //   foreignKey: 'other_model_id',
    //   sourceKey: 'id'
    // });
    // factory.NewModel.associationModels = {
    //   otherModelOfNewModel: factory.OtherModel
    // };
  };
  return NewModel;
}
