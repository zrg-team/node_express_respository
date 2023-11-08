'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pagination extends Model {
    static associate(models) {
      // define association here
    }
  };
  Pagination.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    currentPage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'current_page'
    },
    perPage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'per_page'
    },
    totalPages: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'total_pages'
    },
    hasPagination: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'has_pagination'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'Pagination',
    tableName: 'paginations',
    timestamps: true,
    underscored: true
  });
  return Pagination;
};
