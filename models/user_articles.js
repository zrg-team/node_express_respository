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
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
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
  UserArticles.associate = (factory) => {
    UserArticles.belongsTo(factory.User, {
      foreignKey: 'user_id',
      targetKey: 'id'
    })
    UserArticles.belongsTo(factory.Article, {
      foreignKey: 'article_id',
      targetKey: 'id'
    })
  }
  return UserArticles
}
