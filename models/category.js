'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // define association here
      Category.hasMany(models.ArticleCategory, { foreignKey: 'category_id' });
    }
  };
  Category.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};
