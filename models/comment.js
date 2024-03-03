'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    article_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Article',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {
    tableName: 'comments'
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Article, { foreignKey: 'article_id', as: 'article' });
    Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'author' });
  };

  return Comment;
};
