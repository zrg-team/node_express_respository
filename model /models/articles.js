// PATH: /models/articles.js
/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  const articles = sequelize.define('articles', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'articles',
    timestamps: false
  });
  articles.associate = function(models) {
    articles.belongsTo(models.users, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };
  return articles;
}
