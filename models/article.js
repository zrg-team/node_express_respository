/* jshint indent: 2 */
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
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
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
        model: 'User',
        key: 'id'
      }
    }
  }, {
    tableName: 'articles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  Article.associate = function(models) {
    Article.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'author'
    });
  };
  return Article;
};
