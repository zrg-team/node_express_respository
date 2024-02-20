const { Model, DataTypes } = require('sequelize');

class Category extends Model {}

Category.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  created_at: { type: DataTypes.DATE, allowNull: false },
  updated_at: { type: DataTypes.DATE, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false }
}, { sequelize, modelName: 'category' });
