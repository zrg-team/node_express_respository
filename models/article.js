// PATH: /models/article.js
module.exports = function (sequelize, DataTypes) {
  const Article = sequelize.define('articles', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'articles',
    timestamps: false
  });
  Article.associate = function(models) {
    Article.belongsTo(models.users, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };
  return Article;
};
