module.exports = function (sequelize, DataTypes) {
  const Article = sequelize.define('articles', {
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
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'articles'
  })
  Article.associate = (models) => {
    Article.belongsTo(models.users, {
      foreignKey: 'user_id',
      as: 'user'
    })
    Article.hasMany(models.user_articles, {
      foreignKey: 'article_id',
      as: 'userArticles'
    })
  }
  return Article
}
