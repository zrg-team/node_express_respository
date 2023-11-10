const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
class Article extends Model {}
Article.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  user_id: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Article',
  tableName: 'articles',
  underscored: true,
});
module.exports = Article;
