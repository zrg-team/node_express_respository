
const { sequelize, DataTypes } = require('sequelize');
const hooks = require('../utils/hooks'); // Assuming hooks utility exists similar to bcryptService

module.exports = function (sequelize, DataTypes) {
  const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    published_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: 1
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    // ... other columns
  }, {
    hooks,
    tableName: 'articles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'author'
    });
    Article.hasMany(models.Comment, {
      foreignKey: 'article_id',
      as: 'comments'
    });
  };

  return Article;
};
