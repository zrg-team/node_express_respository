/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  const Article = sequelize.define('articles', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(256),
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
    tableName: 'articles',
    timestamps: false
  });
  Article.associate = (factory) => {
    factory.articles.belongsTo(factory.users, {
      as: 'userOfArticle',
      foreignKey: 'user_id',
      sourceKey: 'id'
    });
    factory.articles.associationModels = {
      userOfArticle: factory.users
    };
  };
  return Article;
};
