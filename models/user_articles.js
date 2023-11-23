module.exports = function (sequelize, DataTypes) {
  const UserArticles = sequelize.define('user_articles', {
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
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'user_articles'
  })
  UserArticles.associate = (models) => {
    UserArticles.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    })
    UserArticles.belongsTo(models.Article, {
      foreignKey: 'article_id',
      as: 'article'
    })
  }
  return UserArticles
}
