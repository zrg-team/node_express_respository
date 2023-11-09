/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  const articles = sequelize.define('articles', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
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