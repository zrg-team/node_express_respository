'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('comment', {
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    article_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, { tableName: 'comments' });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Comment.belongsTo(models.Article, { foreignKey: 'article_id', as: 'article' });
  };

  return Comment;
};
