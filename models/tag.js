const { Model, DataTypes } = require('sequelize');

class Tag extends Model {}

Tag.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  name: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Tag'
});

module.exports = Tag;
