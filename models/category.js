const hooks = {}
module.exports = function (sequelize, DataTypes) {
  const Category = sequelize.define('category', {
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    hooks,
    tableName: 'categories'
  })
  Category.associate = (factory) => {
    factory.Category.hasMany(factory.ArticleCategory, {
      as: 'articleCategories',
      foreignKey: 'category_id',
      sourceKey: 'id'
    })
    factory.Category.associationModels = {
      articleCategories: factory.ArticleCategory
    }
  }
  return Category
}
